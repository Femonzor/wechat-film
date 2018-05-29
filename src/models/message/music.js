import Base from "./base";

class Music extends Base {
    constructor(Title, Description, MusicUrl, HQMusicUrl, ThumbMediaId) {
        super();
        Object.assign(this, {
            Title,
            Description,
            MusicUrl,
            HQMusicUrl,
            ThumbMediaId
        });
    }
}

export default Music;
