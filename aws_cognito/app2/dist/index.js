"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
console.log('Loading read function');
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || '';
const docClient = new aws_sdk_1.DynamoDB.DocumentClient();
const handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const artist = event.artist ? event.artist : (event.queryStringParameters ? event.queryStringParameters.artist : null);
    if (!artist) {
        callback(null, {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Artist parameter is missing' })
        });
        return;
    }
    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'Artist = :artist',
        ExpressionAttributeValues: {
            ':artist': artist
        }
    };
    docClient.query(params, (err, data) => {
        if (err) {
            console.log('Error', err);
            callback(null, {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message })
            });
        }
        else {
            console.log('Success', data);
            callback(null, {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data.Items)
            });
        }
    });
};
exports.handler = handler;
