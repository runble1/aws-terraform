import * as http from 'http';
import { Firehose } from 'aws-sdk';

// Kinesis Firehoseクライアントを初期化
const firehose = new Firehose();
const firehoseStreamName = 'your_firehose_stream_name';

// HTTPサーバーを起動してログデータをリッスン
http.createServer((req, res) => {
    let logData = '';

    req.on('data', chunk => {
        logData += chunk;
    });

    req.on('end', () => {
        // Firehoseにログデータを送信
        const params = {
            DeliveryStreamName: firehoseStreamName,
            Record: { Data: logData }
        };

        firehose.putRecord(params, (err, data) => {
            if (err) {
                console.error('Error sending log data to Firehose:', err);
            } else {
                console.log('Log data sent to Firehose:', data);
            }
        });

        res.writeHead(200);
        res.end();
    });
}).listen(8080);

console.log('Lambda Extension is listening for log events...');
