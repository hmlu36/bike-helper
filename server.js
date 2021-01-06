const bodyParser = require('body-parser');
const express = require('express');
const lineNotify = require('./src/lineNotify');


const port = Number(process.env.PORT) || 5000;
const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;

app.prepare().then(() => {
    const server = express();

    server.use(
        bodyParser.json({
            verify: (req, _, buf) => {
                req.rawBody = buf.toString();
            },
        })
    );

    server.get('/notify/redirect', async function (req, res) {
        const code = req.query.code;
        const token = await lineNotify.getToken(code, redirectUri, clientId, clientSecret);
        await lineNotify.sendNotify(token, '預報');
    });

    // route for webhook request
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, err => {
        if (err) throw err;
    });
});