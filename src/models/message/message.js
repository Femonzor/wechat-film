import Base from "./base";

class Message extends Base {
    /**
     * Message构造函数
     * @param {string} ToUserName   接收方帐号（收到的OpenID）
     * @param {string} FromUserName 开发者微信号
     * @param {string} MsgType      消息类型
     */
    constructor(ToUserName, FromUserName, MsgType) {
        super();
        Object.assign(this, {
            ToUserName,
            FromUserName,
            CreateTime: new Date().getTime(),
            MsgType
        });
    }
}

export default Message;
