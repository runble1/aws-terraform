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
    var _a, _b, _c;
    const params = {
        TableName: 'ProductPrices',
        Key: {
            ProductID: { S: 'EXAMPLE123' },
            CheckDate: { S: '2023-02-18' },
        },
    };
    try {
        const { Item } = yield client.send(new client_dynamodb_1.GetItemCommand(params));
        if (!Item) {
            return JSON.stringify({ message: 'Item not found' });
        }
        // DynamoDBのレスポンスを適切な形式に変換
        const dataToValidate = {
            ProductID: Item.ProductID.S,
            CheckDate: Item.CheckDate.S,
            Price: ((_a = Item.Price) === null || _a === void 0 ? void 0 : _a.N) ? parseFloat(Item.Price.N) : undefined,
            PreviousPrice: ((_b = Item.PreviousPrice) === null || _b === void 0 ? void 0 : _b.N) ? parseFloat(Item.PreviousPrice.N) : undefined,
            PriceChange: ((_c = Item.PriceChange) === null || _c === void 0 ? void 0 : _c.N) ? parseFloat(Item.PriceChange.N) : undefined,
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
    }
    catch (err) {
        console.error('Error', err);
        return JSON.stringify({ message: `Error getting item from DynamoDB: ${err}` });
    }
});
