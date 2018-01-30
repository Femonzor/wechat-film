import Message from "../message";
import MessageArticle from "../article"
import { NEWS_TYPE } from "../../constant/message";

class NewsMessage extends Message {
    constructor(paramObj) {
        const { ToUserName, FromUserName, ArticleCount } = paramObj;
        super(ToUserName, FromUserName, NEWS_TYPE);
        const Articles = paramObj.Articles.forEach(item => new MessageArticle(item));
        Object.assign(this, {
            ArticleCount,
            Articles
        });
    }
}

export default NewsMessage;
