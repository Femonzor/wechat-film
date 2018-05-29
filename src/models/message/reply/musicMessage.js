import Message from "../message";
import MessageMusic from "../music";
import { MUSIC_TYPE } from "../../../constants/message";

class MusicMessage extends Message {
    constructor(paramObj) {
        const {
            ToUserName,
            FromUserName,
            Title,
            Description,
            MusicUrl,
            HQMusicUrl,
            ThumbMediaId
        } = paramObj;
        super(ToUserName, FromUserName, MUSIC_TYPE);
        Object.assign(this, {
            Music: new MessageMusic(Title, Description, MusicUrl, HQMusicUrl, ThumbMediaId)
        });
    }
}

export default MusicMessage;
