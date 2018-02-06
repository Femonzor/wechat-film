import Message from "../message";
import MessageImage from "../image";
import { IMAGE_TYPE } from "../../../constant/message";

class ImageMessage extends Message {
    constructor(paramObj) {
        const { ToUserName, FromUserName, MediaId } = paramObj;
        super(ToUserName, FromUserName, IMAGE_TYPE);
        Object.assign(this, {
            Image: new MessageImage(MediaId)
        });
    }
}

export default ImageMessage;
