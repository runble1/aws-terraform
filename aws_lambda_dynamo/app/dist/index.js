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
// handlers/getProductPrice.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynamodbClient_1 = require("./utils/dynamodbClient");
const productPrice_1 = require("./models/productPrice");
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const params = {
        TableName: "ProductPrices",
        Key: {
            ProductID: { S: "EXAMPLE123" },
            CheckDate: { S: "2023-02-18" },
        },
    };
    try {
        // DyanmoDB から値を取得
        const { Item } = yield dynamodbClient_1.client.send(new client_dynamodb_1.GetItemCommand(params));
        if (!Item)
            throw new Error("Item not found");
        // DynamoDBから取得した値がundefinedでないことを確認、またはデフォルト値を使用
        const price = ((_a = Item.Price) === null || _a === void 0 ? void 0 : _a.N) ? parseFloat(Item.Price.N) : 0;
        const previousPrice = ((_b = Item.PreviousPrice) === null || _b === void 0 ? void 0 : _b.N) ? parseFloat(Item.PreviousPrice.N) : 0;
        const priceChange = ((_c = Item.PriceChange) === null || _c === void 0 ? void 0 : _c.N) ? parseFloat(Item.PriceChange.N) : 0;
        // Zodスキーマでのバリデーション
        const productPrice = productPrice_1.ProductPriceSchema.parse({
            ProductID: Item.ProductID.S,
            CheckDate: Item.CheckDate.S,
            Price: ((_d = Item.Price) === null || _d === void 0 ? void 0 : _d.N) ? parseFloat(Item.Price.N) : undefined,
            PreviousPrice: ((_e = Item.PreviousPrice) === null || _e === void 0 ? void 0 : _e.N) ? parseFloat(Item.PreviousPrice.N) : undefined,
            PriceChange: ((_f = Item.PriceChange) === null || _f === void 0 ? void 0 : _f.N) ? parseFloat(Item.PriceChange.N) : undefined,
            Title: (_g = Item.Title) === null || _g === void 0 ? void 0 : _g.S,
            URL: (_h = Item.URL) === null || _h === void 0 ? void 0 : _h.S
        });
        console.log("Validated Product Price:", productPrice);
        return productPrice;
    }
    catch (err) {
        console.error("Error", err);
        throw new Error(`Error getting item from DynamoDB: ${err}`);
    }
});
