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
exports.dispatch = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const firehose = new aws_sdk_1.default.Firehose();
const firehoseStreamName = 'dev-lambda-extension-telemetry-api-log-stream';
const dispatchMinBatchSize = 10;
function dispatch(queue, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if (queue.length !== 0 && (force || queue.length >= dispatchMinBatchSize)) {
            console.log('[telemetry-dispatcher:dispatch] Dispatching', queue.length, 'telemetry events');
            const records = queue.map(item => ({ Data: JSON.stringify(item) }));
            queue.splice(0);
            const params = {
                DeliveryStreamName: firehoseStreamName,
                Records: records
            };
            try {
                const data = yield firehose.putRecordBatch(params).promise();
                console.log('Log data sent to Firehose:', data);
            }
            catch (err) {
                console.error('Error sending log data to Firehose:', err);
            }
        }
    });
}
exports.dispatch = dispatch;
