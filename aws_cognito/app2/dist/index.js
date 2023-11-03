"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
console.log('Loading read function');
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || '';
const docClient = new aws_sdk_1.DynamoDB.DocumentClient();
const handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const params = {
        // TODO: 作成したDynamoDBテーブルの名前に書き換えてください
        TableName: DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'Artist = :artist',
        ExpressionAttributeValues: {
            ':artist': event.artist
        }
    };
    docClient.query(params, (err, data) => {
        if (err) {
            console.log('Error', err);
            callback(Error(err.message));
        }
        else {
            console.log('Success', data);
            callback(null, data.Items);
        }
    });
};
exports.handler = handler;
