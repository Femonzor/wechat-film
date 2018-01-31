import { createReadStream } from "fs";
import request from "request";
import config from "../config"

const requestPromise = Promise.promisify(request);
const { api } = config;

class Wechat {
    constructor(options) {
        Object.assign(this, options);
        this.fetchAccessToken();
    }
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) return false;
        const { access_token, expires_in } = data;
        const now = new Date().getTime();
        return now < expires_in ? true : false;
    }
    updateAccessToken(data) {
        const { appId, appSecret } = this;
        const url = `${api.accessTokenUrl}&appid=${appId}&secret=${appSecret}`;
        return new Promise((resolve, reject) => {
            requestPromise({ url: url, json: true }).then(response => {
                const data = response.body;
                const now = new Date().getTime();
                data.expires_in = now + (data.expires_in - 20) * 1000;
                resolve(data);
            });
        });
    }
    fetchAccessToken() {
        const { access_token, expires_in } = this;
        if (access_token && expires_in && this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
        this.getAccessToken().then(data => {
            try {
                data = JSON.parse(data);
                if (this.isValidAccessToken(data)) {
                    Promise.resolve(data);
                } else {
                    return this.updateAccessToken();
                }
            } catch (error) {
                return this.updateAccessToken();
            }
        }).then(data => {
            Object.assign(this, data);
            this.saveAccessToken(JSON.stringify(data));
            return Promise.resolve(data);
        });
    }
    uploadMedia(type, filePath) {
        const form = {
            media: createReadStream(filePath)
        };
        const { access_token } = this;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const url = `${api.uploadMediaUrl}?access_token=${access_token}&type=${type}`;
            });
        });
    }
}

export default Wechat;