import { Logger } from '@aws-lambda-powertools/logger';
import { sendToFirehose } from '/opt/nodejs/firehoseLoggerLayer'; // Lambda Layerから直接インポート

const logger = new Logger();
const firehoseName = process.env.KINESIS_FIREHOSE_NAME;

// 環境変数の存在を検証
if (!firehoseName) {
  throw new Error('KINESIS_FIREHOSE_NAME is not set');
}

export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  const logData = {
    message: "OK",
    requestId: requestId,
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
  };

  logger.info('Processing event', logData);

  await sendToFirehose(logData, firehoseName);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  };
};
