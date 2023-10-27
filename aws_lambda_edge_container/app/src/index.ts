// index.ts
export const handler = async (event: any, context: any): Promise<any> => {
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
