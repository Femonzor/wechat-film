import ReplyTextMessage from "../model/message/reply/textMessage";

export const getReplyObject = message => {
    const options = {};
    if (message.MsgType === "event") {
        if (message.Event === "subscribe") {
            Object.assign(options, {
                ToUserName: message.FromUserName,
                FromUserName: message.ToUserName,
                Content: "你好！"
            });
            return new ReplyTextMessage(options);
        }
    }
};
