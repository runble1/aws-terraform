import AWS from 'aws-sdk';

const firehose = new AWS.Firehose();

const firehoseStreamName = 'dev-lambda-extension-telemetry-api-log-stream';
const dispatchMinBatchSize = 10;

interface Record {
    Data: string;
}

interface PutRecordBatchRequest {
    DeliveryStreamName: string;
    Records: Record[];
}

export async function dispatch(queue: any[], force: boolean): Promise<void> {
    if (queue.length !== 0 && (force || queue.length >= dispatchMinBatchSize)) {
        console.log('[telemetry-dispatcher:dispatch] Dispatching', queue.length, 'telemetry events');
        const records = queue.map(item => ({ Data: JSON.stringify(item) }));
        queue.splice(0);

        const params: PutRecordBatchRequest = {
            DeliveryStreamName: firehoseStreamName,
            Records: records
        };

        try {
            const data = await firehose.putRecordBatch(params).promise();
            console.log('Log data sent to Firehose:', data);
        } catch (err) {
            console.error('Error sending log data to Firehose:', err);
        }
    }
}
