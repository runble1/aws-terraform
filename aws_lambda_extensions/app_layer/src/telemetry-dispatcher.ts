import { FirehoseClient, PutRecordBatchCommand } from "@aws-sdk/client-firehose";

const firehoseClient = new FirehoseClient({});

const firehoseStreamName = 'dev-lambda-extension-telemetry-api-log-stream';
const dispatchMinBatchSize = 10;

type FirehoseRecord = {
    Data: Uint8Array;
};

export async function dispatch(queue: any[], force: boolean): Promise<void> {
    if (queue.length !== 0 && (force || queue.length >= dispatchMinBatchSize)) {
        console.log('[telemetry-dispatcher:dispatch] Dispatching', queue.length, 'telemetry events');
        
        const records: FirehoseRecord[] = queue.map(item => ({
            Data: new TextEncoder().encode(JSON.stringify(item))
        }));
        queue.splice(0);

        const params = {
            DeliveryStreamName: firehoseStreamName,
            Records: records
        };

        const command = new PutRecordBatchCommand(params);

        try {
            const data = await firehoseClient.send(command);
            console.log('Log data sent to Firehose:', JSON.stringify(data));
        } catch (err) {
            console.error('Error sending log data to Firehose:', err);
        }
    }
}
