"use strict";

import sha1 from "sha1";
import request from "request";

const requestPromise = Promise.promisify(request);
const prefix = "https://api.weixin.qq.com/cgi-bin";
const api = {
    accessTokenUrl: prefix + "/token?grant_type=client_credential"
};

class AccessToken {
    constructor(options) {
        Object.assign(this, options);
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
        });
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
}

export default options => {
    const accessToken = new AccessToken(options);
    return context => {
        const { token } = options;
        const { signature, nonce, timestamp, echostr } = context.query;
        const str = [token, timestamp, nonce].sort().join("");
        const sha = sha1(str);
        if (sha === signature) {
            context.body = echostr + "";
            console.log("success");
        } else {
            context.body = "wrong";
        }
    };
};
