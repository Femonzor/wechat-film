import Base from "./base";

class Music extends Base {
    constructor(Title, Description, MusicURL, HQMusicRul, ThumbMediaId) {
        Object.assign(this, {
            Title,
            Description,
            MusicURL,
            HQMusicRul,
            ThumbMediaId
        });
    }
}

export default Music;
