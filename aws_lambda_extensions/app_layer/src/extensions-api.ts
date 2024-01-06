import fetch from 'node-fetch';
import { basename } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;

export interface LambdaEvent {
    eventType: string;
    // その他のLambdaイベントプロパティ
}

export async function register(): Promise<string | undefined> {
    console.info('[extensions-api:register] Registering using baseUrl', baseUrl);
    const res = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        body: JSON.stringify({
            'events': [
                'INVOKE',
                'SHUTDOWN'
            ],
        }),
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Name': basename(__dirname),
        }
    });

    if (!res.ok) {
        console.error('[extensions-api:register] Registration failed:', await res.text());
        return undefined;
    } else {
        const extensionId = res.headers.get('lambda-extension-identifier');
        if (extensionId === null) {
            return undefined;
        }
        console.info('[extensions-api:register] Registration success with extensionId', extensionId);
        return extensionId;
    }
}

export async function next(extensionId: string): Promise<LambdaEvent | null> {
    console.info('[extensions-api:next] Waiting for next event');
    const res = await fetch(`${baseUrl}/event/next`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        }
    });

    if (!res.ok) {
        console.error('[extensions-api:next] Failed receiving next event', await res.text());
        return null;
    } else {
        const event = await res.json() as LambdaEvent; // 型アサーションを使用
        console.info('[extensions-api:next] Next event received');
        return event;
    }
}
