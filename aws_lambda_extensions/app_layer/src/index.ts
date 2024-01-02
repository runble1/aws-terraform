import * as extensionsApi from './extensions-api';
import * as telemetryApi from './telemetry-api';
import * as telemetryListener from './telemetry-listener';
import * as telemetryDispatcher from './telemetry-dispatcher';
import { LambdaEvent } from './extensions-api';

async function main() {
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    console.log('[index:main] Starting the Telemetry API extension');

    // Step 1 - Register the extension with Extensions API
    console.log('[index:main] Registering extension');
    const extensionId = await extensionsApi.register();
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
    await telemetryApi.subscribe(extensionId, listenerUri);
    console.log('[index:main] Subscription success');

    while (true) {
        console.log('[index:main] Next');

        // This is a blocking action
        const event = await extensionsApi.next(extensionId);

        // nullチェックを追加
        if (event === null) {
            console.error('[index:main] Received null event');
            continue; // 次のループイテレーションに進む
        }

        switch (event.eventType) {
            case 'INVOKE':
                handleInvoke(event);
                await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, false); 
                break;
            case 'SHUTDOWN':
                // Wait for 1 sec to receive remaining events
                await new Promise<void>((resolve) => setTimeout(resolve, 1000)); 

                // Dispatch queued telemetry prior to handling the shutdown event
                await telemetryDispatcher.dispatch(telemetryListener.eventsQueue, true); 
                handleShutdown(event);
                break;
            default:
                throw new Error('[index:main] unknown event: ' + event.eventType);
        }
    }
}

function handleShutdown(event: any): event is LambdaEvent {
    console.log('[index:handleShutdown]');
    process.exit(0);
}

function handleInvoke(event: LambdaEvent): void {
    console.log('[index:handleInvoke]');
}

main().catch(err => console.error(err));
