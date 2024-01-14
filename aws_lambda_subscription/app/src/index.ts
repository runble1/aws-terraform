import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: '', logLevel: 'INFO' });

export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  const logData = {
    message: "user_activity_log",
    requestId: requestId
  };

  logger.info(logData);
  //console.log(logData)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(logData),
  };
};
