// index.ts
export const handler = async (event: any, context: any): Promise<any> => {
  const requestId = event.requestContext.requestId;
  console.log({"message": "OK", "requestId": requestId, "event": event});
  console.error({"message": "ERROR", "requestId": requestId, "event": event});

  return new Promise(function(resolve, reject) {
    resolve({
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({message: "OK", event: event}),
    });
    return;
  });
};
