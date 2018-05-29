import Message from "../message";
import MessageVoice from "../voice";
import { VOICE_TYPE } from "../../../constants/message";

class VoiceMessage extends Message {
    constructor(paramObj) {
        const { ToUserName, FromUserName, MediaId } = paramObj;
        super(ToUserName, FromUserName, VOICE_TYPE);
        Object.assign(this, {
            Voice: new MessageVoice(MediaId)
        });
    }
}

export default VoiceMessage;
