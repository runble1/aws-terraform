export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  // 重要なイベントデータのみをログに記録
  const logData = {
    message: "OK",
    requestId: requestId,
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters
  };

  console.log(logData);
  console.error({ message: "ERROR", requestId: requestId });

  return new Promise(function(resolve, reject) {
    resolve({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });
  });
};
