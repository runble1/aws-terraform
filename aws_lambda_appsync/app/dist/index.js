"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const ajv_1 = __importDefault(require("ajv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// DynamoDBクライアントの初期化
const client = new client_dynamodb_1.DynamoDBClient({ region: 'ap-northeast-1' });
const ajv = new ajv_1.default();
// JSONスキーマファイルの読み込み
const schemaPath = path_1.default.join(__dirname, 'productPriceSchema.json');
const productPriceSchema = JSON.parse((0, fs_1.readFileSync)(schemaPath, 'utf-8'));
const validate = ajv.compile(productPriceSchema);
exports.handler = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield client.send(new client_dynamodb_1.PutItemCommand({
            TableName: 'ProductPrices',
            Item: dynamoDbItem
        }));
        console.log('Item successfully written to DynamoDB.');
        return JSON.stringify({ message: 'Item successfully written to DynamoDB', item: newItem });
    }
    catch (err) {
        console.error('Error writing item to DynamoDB:', err);
        return JSON.stringify({ message: `Error writing item to DynamoDB: ${err}` });
    }
});
