let sendToFirehose: any;

// Lambdaレイヤーから動的にモジュールを読み込む
async function loadFirehoseLoggerLayer() {
  if (!sendToFirehose) {
    sendToFirehose = (await import('/opt/nodejs/firehoseLoggerLayer')).sendToFirehose;
  }
}

const firehoseName = process.env.KINESIS_FIREHOSE_NAME;

export const handler = async (event: any, context: any): Promise<any> => {
  await loadFirehoseLoggerLayer(); // レイヤーからモジュールを読み込む

  const requestId = event.requestContext.requestId;
  const logData = {
    message: "OK",
    requestId: requestId,
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
  };

  await sendToFirehose(logData, firehoseName);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  };
};
