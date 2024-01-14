import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger();

export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  const logData = {
    message: "OK",
    requestId: requestId,
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
  };

  logger.info('powertools', logData);
  console.log('console', logData)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  };
};
