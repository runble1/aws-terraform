import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
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
  const currentDateISO = new Date().toISOString(); 

  const newItem = {
    ProductID: 'EXAMPLE123',
    CheckDate: currentDateISO, // 現在の日付
    Price: 100,
    PreviousPrice: 95,
    PriceChange: 5,
    Title: 'Example Product Title',
    URL: 'https://www.amazon.com/dp/EXAMPLE123'
  };

  // JSON Schemaでのバリデーション
  const valid = validate(newItem);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Data validation failed');
  }

  // DynamoDBの期待する形式に変換
  const dynamoDbItem = {
    ProductID: { S: newItem.ProductID },
    CheckDate: { S: newItem.CheckDate },
    Price: { N: newItem.Price.toString() },
    PreviousPrice: { N: newItem.PreviousPrice.toString() },
    PriceChange: { N: newItem.PriceChange.toString() },
    Title: { S: newItem.Title },
    URL: { S: newItem.URL }
  };

  try {
    // DynamoDBにアイテムを書き込む
    await client.send(new PutItemCommand({
      TableName: 'ProductPrices',
      Item: dynamoDbItem
    }));
    console.log('Item successfully written to DynamoDB.');
    return JSON.stringify({ message: 'Item successfully written to DynamoDB', item: newItem });
  } catch (err) {
    console.error('Error writing item to DynamoDB:', err);
    return JSON.stringify({ message: `Error writing item to DynamoDB: ${err}` });
  }
};
