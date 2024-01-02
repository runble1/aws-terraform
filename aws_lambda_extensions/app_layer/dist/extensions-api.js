"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.next = exports.register = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = require("path");
const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;
function register() {
    return __awaiter(this, void 0, void 0, function* () {
        console.info('[extensions-api:register] Registering using baseUrl', baseUrl);
        const res = yield (0, node_fetch_1.default)(`${baseUrl}/register`, {
            method: 'POST',
            body: JSON.stringify({
                'events': [
                    'INVOKE',
                    'SHUTDOWN'
                ],
            }),
            headers: {
                'Content-Type': 'application/json',
                'Lambda-Extension-Name': (0, path_1.basename)(__dirname),
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
exports.register = register;
function next(extensionId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.info('[extensions-api:next] Waiting for next event');
        const res = yield (0, node_fetch_1.default)(`${baseUrl}/event/next`, {
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
exports.next = next;
