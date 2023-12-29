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
    const jsonRegex = /\{.*?\}/;
    const match = jsonRegex.exec(message);
    if (match) {
        return match[0];
    }
    else {
        throw new Error("JSON part not found in message");
    }
}
exports.handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield Promise.all(event.records.map((record) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const buffer = Buffer.from(record.data, 'base64');
            const decompressed = (0, zlib_1.gunzipSync)(buffer);
            const data = JSON.parse(decompressed.toString('utf8'));
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
            console.error("Error processing record: ", error);
            return {
                recordId: record.recordId,
                result: 'ProcessingFailed',
            };
        }
    })));
    return { records };
});
