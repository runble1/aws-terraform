import { FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseRecordTransformationStatus, Context } from 'aws-lambda';
import { gunzipSync } from 'zlib';

interface CloudWatchLogsData {
  messageType: string;
  owner: string;
  logGroup: string;
  logStream: string;
  subscriptionFilters: string[];
  logEvents: Array<{
    id: string;
    timestamp: number;
    message: string;
  }>;
}

function transformLogEvent(logEvent: { timestamp: number; message: string }): Promise<string> {
  try {
    const jsonPart = extractJsonPart(logEvent.message);
    return Promise.resolve(jsonPart);
  } catch (error) {
    console.error("Error in transformLogEvent: ", error);
    return Promise.resolve('');
  }
}

function extractJsonPart(message: string): string {
  const jsonRegex = /\{.*?\}/;
  const match = jsonRegex.exec(message);
  if (match) {
    return match[0];
  } else {
    throw new Error("JSON part not found in message");
  }
}

exports.handler = async (event: FirehoseTransformationEvent, context: Context): Promise<FirehoseTransformationResult> => {
  const records = await Promise.all(event.records.map(async (record) => {
    try {
      const buffer = Buffer.from(record.data, 'base64');
      const decompressed = gunzipSync(buffer);
      const data: CloudWatchLogsData = JSON.parse(decompressed.toString('utf8'));

      if (data.messageType !== 'DATA_MESSAGE') {
        return {
          recordId: record.recordId,
          result: 'ProcessingFailed' as FirehoseRecordTransformationStatus,
        };
      } else {
        const transformed = await Promise.all(data.logEvents.map(transformLogEvent));
        const payload = transformed.filter(part => part).join('\n');
        const encoded = Buffer.from(payload).toString('base64');

        return {
          recordId: record.recordId,
          result: 'Ok' as FirehoseRecordTransformationStatus,
          data: encoded,
        };
      }
    } catch (error) {
      console.error("Error processing record: ", error);
      return {
        recordId: record.recordId,
        result: 'ProcessingFailed' as FirehoseRecordTransformationStatus,
      };
    }
  }));

  return { records };
};
