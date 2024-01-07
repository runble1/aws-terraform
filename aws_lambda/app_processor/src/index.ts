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
  } catch (error) {
    console.error("Error parsing JSON: ", error);
    return ''; // エラーが発生した場合は空文字列を返す
  }
}

exports.handler = async (event: FirehoseTransformationEvent, context: Context): Promise<FirehoseTransformationResult> => {
  const records = await Promise.all(event.records.map(async (record) => {
    try {
      console.log(`Processing record: ${record.recordId}`);
      const buffer = Buffer.from(record.data, 'base64');
      console.log("Buffer decoded from base64.");

      const decompressed = gunzipSync(buffer);
      console.log("Data decompressed.");

      const data: CloudWatchLogsData = JSON.parse(decompressed.toString('utf8'));
      console.log(`Parsed CloudWatch logs data: ${JSON.stringify(data)}`);

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
      console.error(`Error processing record ${record.recordId}: `, error);
      return {
        recordId: record.recordId,
        result: 'ProcessingFailed' as FirehoseRecordTransformationStatus,
      };
    }
  })) as FirehoseTransformationResult['records']; // 型アサーション

  return { records };
};
