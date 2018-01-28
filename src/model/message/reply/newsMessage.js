import Message from "../message";
import { NEWS_TYPE } from "../../constant/message";

class NewsMessage extends Message {
    constructor(ToUserName, FromUserName, ArticleCount, Articles, Title, Description, PicUrl, Url) {
        super(ToUserName, FromUserName, NEWS_TYPE);
        Object.assign(this, {
            ArticleCount,
            Articles,
            Title,
            Description,
            PicUrl,
            Url
        });
    }
}

export default NewsMessage;
