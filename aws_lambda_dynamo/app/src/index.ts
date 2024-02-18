import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import Ajv from 'ajv';
import { readFileSync } from 'fs';
import path from 'path';

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({ region: 'ap-northeast-1' });

const ajv = new Ajv();

// JSONスキーマファイルの読み込み
const schemaPath = path.join(__dirname, 'productPriceSchema.json');
const productPriceSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

const validate = ajv.compile(productPriceSchema);

exports.handler = async () => {
  const params = {
    TableName: 'ProductPrices',
    Key: {
      ProductID: { S: 'EXAMPLE123' },
      CheckDate: { S: '2023-02-18' },
    },
  };

  try {
    const { Item } = await client.send(new GetItemCommand(params));
    if (!Item) {
      return JSON.stringify({ message: 'Item not found' });
    }

    // DynamoDBのレスポンスを適切な形式に変換
    const dataToValidate = {
      ProductID: Item.ProductID.S,
      CheckDate: Item.CheckDate.S,
      Price: Item.Price?.N ? parseFloat(Item.Price.N) : 0,
      PreviousPrice: Item.PreviousPrice?.N ? parseFloat(Item.PreviousPrice.N) : 0,
      PriceChange: Item.PriceChange?.N ? parseFloat(Item.PriceChange.N) : 0,
      Title: Item.Title.S,
      URL: Item.URL.S,
    };

    // JSON Schemaでのバリデーション
    const valid = validate(dataToValidate);
    if (!valid) {
      console.error(validate.errors);
      throw new Error('Data validation failed');
    }

    return JSON.stringify(dataToValidate);
  } catch (err) {
    console.error('Error', err);
    return JSON.stringify({ message: `Error getting item from DynamoDB: ${err}` });
  }
};
