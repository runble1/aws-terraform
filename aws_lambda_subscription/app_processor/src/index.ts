import { FirehoseTransformationEvent, FirehoseTransformationResult, FirehoseRecordTransformationStatus } from 'aws-lambda';
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

const transformLogEvent = (logEvent: { message: string }): string => {
  try {
    const messageData = JSON.parse(logEvent.message);
    // ここで改行を追加
    return JSON.stringify({ message: messageData.message, requestId: messageData.requestId }) + '\n';
  } catch (error) {
    console.error("Error parsing message JSON: ", error, logEvent);
    return '';
  }
}

exports.handler = async (event: FirehoseTransformationEvent): Promise<FirehoseTransformationResult> => {
  const records = event.records.map(record => {
    try {
      const decompressed = gunzipSync(Buffer.from(record.data, 'base64'));
      const data: CloudWatchLogsData = JSON.parse(decompressed.toString('utf8'));

      if (data.messageType !== 'DATA_MESSAGE') {
        console.error("Invalid message type: ", data.messageType);
        return {
          recordId: record.recordId,
          result: 'ProcessingFailed' as FirehoseRecordTransformationStatus,
        };
      }

      const payload = data.logEvents.map(transformLogEvent).join('');
      const encoded = Buffer.from(payload).toString('base64');

      return {
        recordId: record.recordId,
        result: 'Ok' as FirehoseRecordTransformationStatus,
        data: encoded,
      };
    } catch (error) {
      console.error(`Error processing record:`, error, record);
      return {
        recordId: record.recordId,
        result: 'ProcessingFailed' as FirehoseRecordTransformationStatus,
      };
    }
  });

  return { records };
};
