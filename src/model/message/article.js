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

export default Article;
