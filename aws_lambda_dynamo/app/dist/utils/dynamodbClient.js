"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
// utils/dynamodbClient.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
exports.client = new client_dynamodb_1.DynamoDBClient({ region: "ap-northeast-1" });
