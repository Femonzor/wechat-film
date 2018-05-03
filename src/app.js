import Koa from "koa";
import crypto from "crypto";
import ejs from "ejs";
import auth from "./middleware/auth";
import config from "./config";
import Wechat from "./model/wechat";

const app = new Koa();

const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>猜电影</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
</head>
<body>
    <h1>点击标题，开始录音翻译</h1>
    <p id="title"></p>
    <div id="poster"></div>
    <script src="https://zeptojs.com/zepto.min.js"></script>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <script>
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '${config.wechat.appId}', // 必填，公众号的唯一标识
            timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
            nonceStr: '<%= noncestr %>', // 必填，生成签名的随机串
            signature: '<%= signature %>', // 必填，签名
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ] // 必填，需要使用的JS接口列表
        });
    </script>
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
    return shasum.digest("hex");
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
        const wechatApi = new Wechat(config.wechat);
        const accessData = await wechatApi.fetchAccessToken();
        const { access_token } = accessData;
        const ticketData = await wechatApi.fetchTicket(access_token);
        const { ticket } = ticketData;
        const url = context.href;
        const params = getSign(ticket, url);
        console.log("params:", params);
        context.body = ejs.render(template, params);
        return next;
    } else {
        console.log("url: %s", context.url);
    }
    await next();
});

app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999");
