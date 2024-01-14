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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToFirehose = void 0;
const client_firehose_1 = require("@aws-sdk/client-firehose");
// 環境変数や設定からリージョンを取得するように変更
const region = process.env.AWS_REGION || 'ap-northeast-1';
const firehoseClient = new client_firehose_1.FirehoseClient({ region: region });
function sendToFirehose(logData, firehoseName) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            DeliveryStreamName: firehoseName,
            Record: { Data: Buffer.from(JSON.stringify(logData) + "\n", 'utf8') },
        };
        try {
            yield firehoseClient.send(new client_firehose_1.PutRecordCommand(params));
            console.info("Log data sent to Firehose", logData);
        }
        catch (error) {
            console.error("Error sending data to Firehose", error);
            // 必要に応じてエラーを外部に通知する
        }
    });
}
exports.sendToFirehose = sendToFirehose;
