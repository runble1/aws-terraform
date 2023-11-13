import { DynamoDB } from 'aws-sdk';
import { Context, Callback } from 'aws-lambda';

console.log('Loading write function');

const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || '';

const docClient = new DynamoDB.DocumentClient();

export const handler = (event: any, context: Context, callback: Callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const artist = event.artist ? event.artist : (event.body ? JSON.parse(event.body).artist : null);
    const title = event.title ? event.title : (event.body ? JSON.parse(event.body).title : null);

    if (!artist || !title) {
        callback(null, {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Both artist and title parameters are required' })
        });
        return;
    }

    const params = {
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
            Artist: artist,
            Title: title
        }
    };

    docClient.put(params, (err, data) => {
        if (err) {
            console.log('Error', err);
            callback(null, {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: err.message })
            });
        } else {
            console.log('Success', data);
            callback(null, {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: 'Item successfully created' })
            });
        }
    });
};
