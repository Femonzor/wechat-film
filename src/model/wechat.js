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
    updateAccessToken() {
        const { appId, appSecret } = this;
        const url = `${api.accessToken}&appid=${appId}&secret=${appSecret}`;
        return new Promise((resolve, reject) => {
            requestPromise({ url: url, json: true }).then(response => {
                const { body } = response;
                const now = new Date().getTime();
                body.expires_in = now + (body.expires_in - 20) * 1000;
                resolve(body);
            }).catch(error => {
                reject(error);
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
    uploadMaterial(type, material, permanent) {
        let form = {};
        let uploadUrl = api.temporary.upload;
        if (permanent) uploadUrl = api.permanent.uploadMaterial;
        if (type === "img") uploadUrl = api.permanent.uploadImg;
        if (type === "news") {
            uploadUrl = api.permanent.uploadNews;
            form = material;
        } else {
            form.media = createReadStream(material);
            if (type === "video" && permanent) Object.assign(form, permanent);
        }
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                let url = `${uploadUrl}?access_token=${access_token}`;
                if (!permanent || type === "material") url += `&type=${type}`;
                const requestOptions = {
                    method: "POST",
                    url: url,
                    json: true
                };
                if (type === "news") {
                    requestOptions.body = form;
                } else {
                    requestOptions.formData = form;
                }
                requestPromise(requestOptions).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("Upload media fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
}

export default Wechat;
