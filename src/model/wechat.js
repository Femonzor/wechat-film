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
    getMaterial(mediaId, type, permanent) {
        const getUrl = api.temporary.get;
        if (permanent) getUrl = api.permanent.get;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                let url = `${getUrl}?access_token=${access_token}&media_id=${mediaId}`;
                if (!permanent && type === "video") url = url.replace("https://", "http://");
                resolve(url);
            });
        });
    }
    deleteMaterial(mediaId) {
        const form = {
            media_id: mediaId
        };
        const deleteUrl = api.permanent.delete;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${deleteUrl}?access_token=${access_token}`;
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("delete media fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    updateMaterial(mediaId, news) {
        const form = {
            media_id: mediaId
        };
        Object.assign(form, news);
        const  updateUrl = api.permanent.update;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${updateUrl}?access_token=${access_token}`;
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("update media fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    countMaterial() {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.permanent.count}?access_token=${access_token}`;
                requestPromise({
                    method: "GET",
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("count media fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    batchGetMaterial(options) {
        const { type, offset, count } = options;
        Object.assign(options, {
            type: type || "image",
            offset: offset || 0,
            count: count || 1
        });
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.permanent.batchget}?access_token=${access_token}`;
                requestPromise({
                    method: "POST",
                    url,
                    body: options,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("batch get media fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
}

export default Wechat;
