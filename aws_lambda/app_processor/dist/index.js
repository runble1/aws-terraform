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
const zlib_1 = require("zlib");
function transformLogEvent(logEvent) {
    try {
        const jsonPart = extractJsonPart(logEvent.message);
        return Promise.resolve(jsonPart);
    }
    catch (error) {
        console.error("Error in transformLogEvent: ", error);
        return Promise.resolve('');
    }
}
function extractJsonPart(message) {
    try {
        // メッセージのJSON部分だけをターゲットにするための正規表現
        const jsonRegex = /\{[\s\S]*?\}/;
        const match = jsonRegex.exec(message);
        if (!match) {
            console.error("JSON part not found in message: ", message);
            return ''; // JSON部分が見つからない場合は空文字列を返す
        }
        // JSON部分のみを抽出
        const jsonPart = match[0];
        // JavaScriptオブジェクトリテラルをJSON形式に変換
        const correctedJsonPart = jsonPart
            .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":') // プロパティ名をダブルクォーテーションで囲む
            .replace(/: undefined/g, ':"undefined"') // undefined値を文字列に変換
            .replace(/'/g, '"'); // シングルクォートをダブルクォートに変換
        return correctedJsonPart;
    }
    catch (error) {
        console.error("Error parsing JSON: ", error);
        return ''; // エラーが発生した場合は空文字列を返す
    }
}
exports.handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield Promise.all(event.records.map((record) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`Processing record: ${record.recordId}`);
            const buffer = Buffer.from(record.data, 'base64');
            console.log("Buffer decoded from base64.");
            const decompressed = (0, zlib_1.gunzipSync)(buffer);
            console.log("Data decompressed.");
            const data = JSON.parse(decompressed.toString('utf8'));
            console.log(`Parsed CloudWatch logs data: ${JSON.stringify(data)}`);
            if (data.messageType !== 'DATA_MESSAGE') {
                return {
                    recordId: record.recordId,
                    result: 'ProcessingFailed',
                };
            }
            else {
                const transformed = yield Promise.all(data.logEvents.map(transformLogEvent));
                const payload = transformed.filter(part => part).join('\n');
                const encoded = Buffer.from(payload).toString('base64');
                return {
                    recordId: record.recordId,
                    result: 'Ok',
                    data: encoded,
                };
            }
        }
        catch (error) {
            console.error(`Error processing record ${record.recordId}: `, error);
            return {
                recordId: record.recordId,
                result: 'ProcessingFailed',
            };
        }
    }))); // 型アサーション
    return { records };
});
