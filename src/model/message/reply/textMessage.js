import Message from "../message";
import { TEXT_TYPE } from "../../../constant/message";

class TextMessage extends Message {
    constructor(paramObj) {
        const { ToUserName, FromUserName, Content } = paramObj
        super(ToUserName, FromUserName, TEXT_TYPE);
        Object.assign(this, {
            Content
        });
    }
}

export default TextMessage;
