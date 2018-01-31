import Message from "../message";
import { MUSIC_TYPE } from "../../../constant/message";

class MusicMessage extends Message {
    constructor(ToUserName, FromUserName, Title, Description, MusicURL, HQMusicRul, ThumbMediaId) {
        super(ToUserName, FromUserName, MUSIC_TYPE);
        Object.assign(this, {
            Title,
            Description,
            MusicURL,
            HQMusicRul,
            ThumbMediaId
        });
    }
}

export default MusicMessage;
