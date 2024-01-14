import { PutRecordCommand, FirehoseClient } from "@aws-sdk/client-firehose";

// 環境変数や設定からリージョンを取得するように変更
const region = process.env.AWS_REGION || 'ap-northeast-1';
const firehoseClient = new FirehoseClient({ region: region });

export async function sendToFirehose(logData: any, firehoseName: string): Promise<void> {
  const params = {
    DeliveryStreamName: firehoseName,
    Record: { Data: Buffer.from(JSON.stringify(logData) + "\n", 'utf8') },
  };

  try {
    await firehoseClient.send(new PutRecordCommand(params));
    console.info("Log data sent to Firehose", logData);
  } catch (error) {
    console.error("Error sending data to Firehose", error);
    // 必要に応じてエラーを外部に通知する
  }
}
