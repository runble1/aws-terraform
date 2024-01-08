import { PutRecordCommand, FirehoseClient } from "@aws-sdk/client-firehose";

export async function sendToFirehose(logData: any, firehoseName: string): Promise<void> {
  const firehoseClient = new FirehoseClient({ region: "ap-northeast-1" });
  const params = {
    DeliveryStreamName: firehoseName,
    Record: { Data: Buffer.from(JSON.stringify(logData) + "\n", 'utf8') },
  };

  try {
    await firehoseClient.send(new PutRecordCommand(params));
    console.info("Log data sent to Firehose", logData);
  } catch (error) {
    console.error("Error sending data to Firehose", error);
  }
}
