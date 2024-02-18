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
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
// DynamoDBクライアントの初期化
const client = new client_dynamodb_1.DynamoDBClient({ region: "ap-northeast-1" });
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield client.send(new client_dynamodb_1.GetItemCommand(params));
        console.log("Success", data.Item);
        return data.Item;
    }
    catch (err) {
        console.error("Error", err);
        throw new Error(`Error getting item from DynamoDB: ${err}`);
    }
});
