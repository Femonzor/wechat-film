"use strict";

import sha1 from "sha1";
import { request } from "http";
import { resolve } from "dns";

const prefix = "https://api.weixin.qq.com/cgi-bin";
const api = {
    accessToken: prefix + "/token?grant_type=client_credential"
};

class AccessToken {
    constructor(opts) {
        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        let data;
        try {
            const accessToken = this.getAccessToken();
            data = JSON.parse(accessToken);
            if (!this.isValidAccessToken(data)) {
                data = this.updateAccessToken();
            }
        } catch (e) {
            data = this.updateAccessToken();
        }
        this.accessToken = data.accessToken;
        this.expiresIn = data.expiresIn;
        this.saveAccessToken(data);
    }
    isValidAccessToken(data) {
        if (!data || !data.accessToken || !data.expiresIn) return false;
        const { accessToken, expiresIn } = data;
        const now = new Date().getTime();
        return now < expiresIn ? true : false;
    }
    updateAccessToken(data) {
        const { appId, appSecret } = this;
        const url = `${api.accessToken}&appid=${appId}&secret=${appSecret}`;
        return new Promise((resolve, reject) => {
            request({
                url: url,
                json: true
            }, (response) => {
                const data = response[1];
                const now = new Date().getTime();
                const expiresIn = now + (data.expiresIn - 20) * 1000;
                data.expiresIn = expiresIn;
                resolve(data);
            });
        });
    }
}

export default opts => context => {
    const { token } = opts;
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