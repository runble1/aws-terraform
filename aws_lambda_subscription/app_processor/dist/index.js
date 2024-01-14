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
const transformLogEvent = (logEvent) => {
    try {
        const messageData = JSON.parse(logEvent.message);
        return JSON.stringify({ message: messageData.message, requestId: messageData.requestId });
    }
    catch (error) {
        console.error("Error parsing message JSON: ", error, logEvent);
        return '';
    }
};
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const records = event.records.map(record => {
        try {
            const decompressed = (0, zlib_1.gunzipSync)(Buffer.from(record.data, 'base64'));
            const data = JSON.parse(decompressed.toString('utf8'));
            if (data.messageType !== 'DATA_MESSAGE') {
                console.error("Invalid message type: ", data.messageType);
                return {
                    recordId: record.recordId,
                    result: 'ProcessingFailed',
                };
            }
            const payload = data.logEvents.map(transformLogEvent).filter(part => part).join('\n');
            const encoded = Buffer.from(payload).toString('base64');
            return {
                recordId: record.recordId,
                result: 'Ok',
                data: encoded,
            };
        }
        catch (error) {
            console.error(`Error processing record:`, error, record);
            return {
                recordId: record.recordId,
                result: 'ProcessingFailed',
            };
        }
    });
    return { records };
});
