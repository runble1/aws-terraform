"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const extensionsApi = __importStar(require("./extensions-api"));
const telemetryApi = __importStar(require("./telemetry-api"));
const telemetryListener = __importStar(require("./telemetry-listener"));
const telemetryDispatcher = __importStar(require("./telemetry-dispatcher"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        process.on('SIGINT', () => handleShutdown('SIGINT'));
        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
        console.log('[index:main] Starting the Telemetry API extension');
        // Step 1 - Register the extension with Extensions API
        console.log('[index:main] Registering extension');
        const extensionId = yield extensionsApi.register();
        if (extensionId === undefined) {
            throw new Error('[index:main] Failed to register extension');
        }
        console.log('[index:main] Registered with extensionId', extensionId);
        // Step 2 - Start the local http listener which will receive data from Telemetry API
        console.log('[index:main] Starting the telemetry listener');
        const listenerUri = telemetryListener.start();
        console.log('[index:main] Telemetry listener started at', listenerUri);
        // Step 3 - Subscribe the listener to Telemetry API 
        console.log('[index:main] Subscribing the telemetry listener to Telemetry API');
        yield telemetryApi.subscribe(extensionId, listenerUri);
        console.log('[index:main] Subscription success');
        while (true) {
            console.log('[index:main] Next');
            // This is a blocking action
            const event = yield extensionsApi.next(extensionId);
            // nullチェックを追加
            if (event === null) {
                console.error('[index:main] Received null event');
                continue; // 次のループイテレーションに進む
            }
            switch (event.eventType) {
                case 'INVOKE':
                    handleInvoke(event);
                    yield telemetryDispatcher.dispatch(telemetryListener.eventsQueue, false);
                    break;
                case 'SHUTDOWN':
                    // Wait for 1 sec to receive remaining events
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                    // Dispatch queued telemetry prior to handling the shutdown event
                    yield telemetryDispatcher.dispatch(telemetryListener.eventsQueue, true);
                    handleShutdown(event);
                    break;
                default:
                    throw new Error('[index:main] unknown event: ' + event.eventType);
            }
        }
    });
}
function handleShutdown(event) {
    console.log('[index:handleShutdown]');
    process.exit(0);
}
function handleInvoke(event) {
    console.log('[index:handleInvoke]');
}
main().catch(err => console.error(err));
