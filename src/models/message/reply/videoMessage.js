import Message from "../message";
import MessageVideo from "../video";
import { VIDEO_TYPE } from "../../../constants/message";

class VideoMessage extends Message {
    constructor(paramObj) {
        const { ToUserName, FromUserName, MediaId, Title, Description } = paramObj;
        super(ToUserName, FromUserName, VIDEO_TYPE);
        Object.assign(this, {
            Video: new MessageVideo(MediaId, Title, Description)
        });
    }
}

export default VideoMessage;
