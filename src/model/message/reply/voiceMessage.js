import Message from "../message";
import { VOICE_TYPE } from "../../../constant/message";

class VoiceMessage extends Message {
    constructor(ToUserName, FromUserName, MediaId) {
        super(ToUserName, FromUserName, VOICE_TYPE);
        Object.assign(this, {
            MediaId
        });
    }
}

export default VoiceMessage;
