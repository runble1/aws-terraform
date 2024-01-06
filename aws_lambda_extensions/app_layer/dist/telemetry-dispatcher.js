var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FirehoseClient, PutRecordBatchCommand } from "@aws-sdk/client-firehose";
const firehoseClient = new FirehoseClient({});
const firehoseStreamName = 'dev-lambda-extension-telemetry-api-log-stream';
const dispatchMinBatchSize = 10;
export function dispatch(queue, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (queue.length !== 0 && (force || queue.length >= dispatchMinBatchSize)) {
            console.log('[telemetry-dispatcher:dispatch] Dispatching', queue.length, 'telemetry events');
            const records = queue.map(item => ({
                Data: new TextEncoder().encode(JSON.stringify(item))
            }));
            queue.splice(0);
            const params = {
                DeliveryStreamName: firehoseStreamName,
                Records: records
            };
            const command = new PutRecordBatchCommand(params);
            try {
                const data = yield firehoseClient.send(command);
                console.log('Log data sent to Firehose:', JSON.stringify(data));
            }
            catch (err) {
                console.error('Error sending log data to Firehose:', err);
            }
        }
    });
}
