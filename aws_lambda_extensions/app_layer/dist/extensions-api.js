var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
import { basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;
export function register() {
    return __awaiter(this, void 0, void 0, function* () {
        console.info('[extensions-api:register] Registering using baseUrl', baseUrl);
        const res = yield fetch(`${baseUrl}/register`, {
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
            console.error('[extensions-api:register] Registration failed:', yield res.text());
            return undefined;
        }
        else {
            const extensionId = res.headers.get('lambda-extension-identifier');
            if (extensionId === null) {
                return undefined;
            }
            console.info('[extensions-api:register] Registration success with extensionId', extensionId);
            return extensionId;
        }
    });
}
export function next(extensionId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info('[extensions-api:next] Waiting for next event');
        const res = yield fetch(`${baseUrl}/event/next`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Lambda-Extension-Identifier': extensionId,
            }
        });
        if (!res.ok) {
            console.error('[extensions-api:next] Failed receiving next event', yield res.text());
            return null;
        }
        else {
            const event = yield res.json(); // 型アサーションを使用
            console.info('[extensions-api:next] Next event received');
            return event;
        }
    });
}
