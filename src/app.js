import Koa from "koa";
import crypto from "crypto";
import auth from "./middleware/auth";
import config from "./config";

const app = new Koa();

const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>猜电影</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1, minimum-scale=1">
</head>
<body>
    <h1>点击标题，开始录音翻译</h1>
    <p id="title"></p>
    <div id="poster"></div>
    <script src="http://zeptojs.com/zepto.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
</body>
</html>
`;

const createNonce = () => Math.random().toString(36).substr(2, 15);

const createTimestamp = () => (parseInt(new Date().getTime() / 1000, 10) + "");

const sign = (noncestr, ticket, timestamp, url) => {
    const params = [
        "noncestr=" + noncestr,
        "jsapi_ticket=" + ticket,
        "timestamp=" + timestamp,
        "url=" + url
    ];
    const str = params.sort().join("&");
    const shasum = crypto.createHash("sha1");
    shasum.update(str);
    return shanum.digest("hex");
};

const getSign = (ticket, url) => {
    const noncestr = createNonce();
    const timestamp = createTimestamp();
    const signature = sign(noncestr, ticket, timestamp, url);
    return {
        noncestr,
        timestamp,
        signature
    };
};

app.use(async (context, next) => {
    if (context.url.indexOf("/movie") > -1) {
        context.body = template;
        return next;
    }
    await next();
});

app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999");
