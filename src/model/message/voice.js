import Base from "./base";

class Voice extends Base {
    /**
     * MessageVoice构造函数
     * @param {string} MediaId 通过素材管理中的接口上传多媒体文件得到的id
     */
    constructor(MediaId) {
        Object.assign(this, {
            MediaId
        });
    }
}

export default Voice;
