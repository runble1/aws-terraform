import fetch from 'node-fetch';

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2022-07-01/telemetry`;
const TIMEOUT_MS = 1000; // Maximum time (in milliseconds) that a batch is buffered.
const MAX_BYTES = 256 * 1024; // Maximum size in bytes that the logs are buffered in memory.
const MAX_ITEMS = 10000; // Maximum number of events that are buffered in memory.

interface SubscriptionBody {
    schemaVersion: string;
    destination: {
        protocol: string;
        URI: string;
    };
    types: string[];
    buffering: {
        timeoutMs: number;
        maxBytes: number;
        maxItems: number;
    };
}

export async function subscribe(extensionId: string, listenerUri: string): Promise<void> {
    console.log('[telemetry-api:subscribe] Subscribing', JSON.stringify({ baseUrl, extensionId, listenerUri }));

    const subscriptionBody: SubscriptionBody = {
        schemaVersion: "2022-07-01",
        destination: {
            protocol: "HTTP",
            URI: listenerUri,
        },
        types: ['function'], // 'function', 'extension'
        buffering: {
            timeoutMs: TIMEOUT_MS,
            maxBytes: MAX_BYTES,
            maxItems: MAX_ITEMS
        }
    };

    const res = await fetch(baseUrl, {
        method: 'PUT',
        body: JSON.stringify(subscriptionBody),
        headers: {
            'Content-Type': 'application/json',
            'Lambda-Extension-Identifier': extensionId,
        }
    });

    switch (res.status) {
        case 200:
            console.log('[telemetry-api:subscribe] Subscription success:', await res.text());
            break;
        case 202:
            console.warn('[telemetry-api:subscribe] Telemetry API not supported. Are you running the extension locally?');
            break;
        default:
            console.error('[telemetry-api:subscribe] Subscription failure:', await res.text());
            break;
    }
}
