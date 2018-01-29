import ReplyTextMessage from "../model/message/reply/textMessage";

export const getReplyObject = message => {
    let Content = "";
    const options = {};
    const { MsgType } = message;
    if (MsgType === "event") {
        const { Event } = message;
        if (Event === "subscribe") {
            console.log(`扫二维码进来: ${message.EventKey} ${message.Ticket}`);
            Content = "您好!"
        } else if (Event === "unsubscribe") {
            console.log("取消关注!");
        } else if (Event === "LOCATION") {
            Content = `您上报的位置是: ${message.Latitude}/${message.Longitude}-${message.Precision}`;
        } else if (Event === "CLICK") {
            Content = `您点击了菜单: ${message.EventKey}`;
        } else if (Event === "SCAN") {
            console.log(`关注后扫二维码: ${message.EventKey} ${message.Ticket}`);
            Content = "又扫了下二维码～";
        } else if (Event === "VIEW") {
            Content = `您点击了菜单中的链接: ${message.EventKey}`;
        }
    } else if (MsgType === "text") {
        const content = message.Content;
        Content = content === "1" ? "大米" : "豆腐";
    }
    Object.assign(options, {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        Content
    });
    return new ReplyTextMessage(options);
};
