import Base from "./base";

class Video extends Base {
    /**
     * MessageVideo构造函数
     * @param {string} MediaId 
     * @param {string} Title 
     * @param {string} Description 
     */
    constructor(MediaId, Title, Description) {
        Object.assign(this, {
            MediaId,
            Title,
            Description
        });
    }
}

export default Voice;
