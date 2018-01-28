import Message from "../message";
import { TEXT_TYPE } from "../../constant/message";

class TextMessage extends Message {
    constructor(ToUserName, FromUserName, Content) {
        super(ToUserName, FromUserName, TEXT_TYPE);
        Object.assign(this, {
            Content
        });
    }
}

export default TextMessage;
