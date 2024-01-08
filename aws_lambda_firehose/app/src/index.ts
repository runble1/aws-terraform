import { PutRecordCommand, FirehoseClient } from "@aws-sdk/client-firehose";

const firehoseName = process.env.KINESIS_FIREHOSE_NAME;

export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  const logData = {
    message: "OK",
    requestId: requestId,
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
  };

  const firehoseClient = new FirehoseClient({ region: "ap-northeast-1" });
  const params = {
    DeliveryStreamName: firehoseName,
    Record: { Data: Buffer.from(JSON.stringify(logData) + "\n") },
  };

  try {
    await firehoseClient.send(new PutRecordCommand(params));
    console.log("Log data sent to Firehose:", logData);
  } catch (error) {
    console.error("Error sending data to Firehose:", error);
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  };
};
