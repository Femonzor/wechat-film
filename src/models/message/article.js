import Base from "./base";

class Article extends Base {
    constructor(article) {
        const { Title, Description, PicUrl, Url } = article;
        super();
        Object.assign(this, {
            Title,
            Description,
            PicUrl,
            Url
        });
    }
}

Article.prototype.closureTag = "item";

export default Article;
