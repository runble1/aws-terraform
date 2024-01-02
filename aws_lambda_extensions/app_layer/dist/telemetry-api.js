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
exports.subscribe = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2022-07-01/telemetry`;
const TIMEOUT_MS = 1000; // Maximum time (in milliseconds) that a batch is buffered.
const MAX_BYTES = 256 * 1024; // Maximum size in bytes that the logs are buffered in memory.
const MAX_ITEMS = 10000; // Maximum number of events that are buffered in memory.
function subscribe(extensionId, listenerUri) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[telemetry-api:subscribe] Subscribing', { baseUrl, extensionId, listenerUri });
        const subscriptionBody = {
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
        const res = yield (0, node_fetch_1.default)(baseUrl, {
            method: 'PUT',
            body: JSON.stringify(subscriptionBody),
            headers: {
                'Content-Type': 'application/json',
                'Lambda-Extension-Identifier': extensionId,
            }
        });
        switch (res.status) {
            case 200:
                console.log('[telemetry-api:subscribe] Subscription success:', yield res.text());
                break;
            case 202:
                console.warn('[telemetry-api:subscribe] Telemetry API not supported. Are you running the extension locally?');
                break;
            default:
                console.error('[telemetry-api:subscribe] Subscription failure:', yield res.text());
                break;
        }
    });
}
exports.subscribe = subscribe;
