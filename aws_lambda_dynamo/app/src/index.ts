// handlers/getProductPrice.ts
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./utils/dynamodbClient";
import { ProductPrice, ProductPriceSchema } from "./models/productPrice";

exports.handler = async (event: any): Promise<ProductPrice> => {
  const params = {
    TableName: "ProductPrices",
    Key: {
      ProductID: { S: "EXAMPLE123" },
      CheckDate: { S: "2023-02-18" },
    },
  };

  try {
    // DyanmoDB から値を取得
    const { Item } = await client.send(new GetItemCommand(params));
    if (!Item) throw new Error("Item not found");

    // Zodスキーマでのバリデーション
    const productPrice = ProductPriceSchema.parse({
      ProductID: Item.ProductID.S,
      CheckDate: Item.CheckDate.S,
      Price: Item.Price?.N ? parseFloat(Item.Price.N) : undefined,
      PreviousPrice: Item.PreviousPrice?.N ? parseFloat(Item.PreviousPrice.N) : undefined,
      PriceChange: Item.PriceChange?.N ? parseFloat(Item.PriceChange.N) : undefined,
      Title: Item.Title?.S,
      URL: Item.URL?.S
    });

    console.log("Validated Product Price:", productPrice);
    return productPrice;
  } catch (err) {
    console.error("Error", err);
    throw new Error(`Error getting item from DynamoDB: ${err}`);
  }
};
