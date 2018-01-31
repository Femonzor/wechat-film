import Message from "../message";
import { VIDEO_TYPE } from "../../../constant/message";

class VideoMessage extends Message {
    constructor(ToUserName, FromUserName, MediaId, Title, Description) {
        super(ToUserName, FromUserName, VIDEO_TYPE);
        Object.assign(this, {
            MediaId,
            Title,
            Description
        });
    }
}
