import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({ region: "ap-northeast-1" });

exports.handler = async (event: any) => {
  // イベントからProductIDを取得
  //const productId = event.ProductID;
  //const productId = "EXAMPLE123";

  // GetItemコマンドのパラメータ
  const params = {
    TableName: "ProductPrices",
    Key: {
      ProductID: { S: "EXAMPLE123" },
      CheckDate: { S: "2023-02-18" } // ソートキーも正確に指定
    }
  };

  try {
    // DynamoDBからアイテムを取得
    const data = await client.send(new GetItemCommand(params));
    console.log("Success", data.Item);
    return data.Item;
  } catch (err) {
    console.error("Error", err);
    throw new Error(`Error getting item from DynamoDB: ${err}`);
  }
};
