import express from 'express';
const LISTENER_HOST = process.env.AWS_SAM_LOCAL === 'true' ? '0.0.0.0' : 'sandbox.localdomain';
const LISTENER_PORT = 4243;
const eventsQueue = []; // ここで`any[]`は受信するイベントの型に置き換えてください
export function start() {
    console.log('[telemetry-listener:start] Starting a listener');
    const server = express();
    server.use(express.json({ limit: '512kb' }));
    server.post('/', (req, res) => {
        if (req.body.length && req.body.length > 0) {
            eventsQueue.push(...req.body);
        }
        console.log('[telemetry-listener:post] received', req.body.length, 'total', eventsQueue.length);
        res.send('OK');
    });
    const listenerUrl = `http://${LISTENER_HOST}:${LISTENER_PORT}`;
    server.listen(LISTENER_PORT, LISTENER_HOST, () => {
        console.log(`[telemetry-listener:start] listening at ${listenerUrl}`);
    });
    return listenerUrl;
}
export { eventsQueue };
