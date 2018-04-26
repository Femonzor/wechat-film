import { createReadStream } from "fs";
import request from "request";
import config from "../config"
import { type } from "../util/common";

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
        // console.log("now: %s, expires_in: %s", now, expires_in);
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
        // console.log("access_token: %s, expires_in: %s", access_token, expires_in);
        if (access_token && expires_in && this.isValidAccessToken(this)) {
            // console.log("isValid");
            return Promise.resolve(this);
        }
        this.getAccessToken().then(data => {
            try {
                // console.log("token: %s", data);
                data = JSON.parse(data);
                if (this.isValidAccessToken(data)) {
                    // console.log("get and isValid");
                    return Promise.resolve(data);
                } else {
                    // console.log("get and need to update");
                    return this.updateAccessToken();
                }
            } catch (error) {
                // console.log("get token into catch: %s", error);
                return this.updateAccessToken();
            }
        }).then(data => {
            // console.log("fetch end promise, data: %s", data);
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
                // console.log("uploadMaterial Promise data:", data);
                const { access_token } = this;
                let url = `${uploadUrl}?access_token=${access_token}`;
                if (!permanent || type !== "news") url += `&type=${type}`;
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
        let getUrl = api.temporary.get;
        if (permanent) getUrl = api.permanent.get;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                let url = `${getUrl}?access_token=${access_token}&media_id=${mediaId}`;
                const form = {};
                const options = {
                    method: "POST",
                    url,
                    json: true
                };
                if (permanent) {
                    Object.assign(form, {
                        media_id: mediaId
                    });
                    options.body = form;
                } else {
                    if (type === "video") {
                        options.url = url.replace("https://", "http://");
                    }
                }
                if (type === "news" || type === "video") {
                    requestPromise(options).then(response => {
                        const { body } = response;
                        if (body) resolve(body);
                        else throw new Error("get media fails");
                    });
                } else {
                    resolve(url);
                }
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
    createGroup(name) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.group.create}?access_token=${access_token}`;
                const form = {
                    group: {
                        name
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("create group fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getGroups() {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.group.get}?access_token=${access_token}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get groups fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getGroupId(openId) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.group.getId}?access_token=${access_token}`;
                const form = {
                    openid: openId
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get group id fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    updateGroup(id, name) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.group.update}?access_token=${access_token}`;
                const form = {
                    group: {
                        id,
                        name
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("update group id fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    moveGroup(openId, toGroupId) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const form = {
                    to_groupid: toGroupId
                };
                let url;
                if (type(openId) === "Array") {
                    form.openid_list = openId;
                    url = `${api.group.batchupdate}?access_token=${access_token}`;
                } else {
                    form.openid = openId;
                    url = `${api.group.move}?access_token=${access_token}`;
                }
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("move group id fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    deleteGroup(id) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.group.delete}?access_token=${access_token}`;
                const form = {
                    group: {
                        id
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("delete group id fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    remarkUser(openId, remark) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.user.remark}?access_token=${access_token}`;
                const form = {
                    openid: openId,
                    remark
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("remark user fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getUsers(openId, lang) {
        lang = lang || "zh_CN";
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const options = {
                    json: true
                };
                if (type(openId) === "Array") {
                    Object.assign(options, {
                        body: {
                            user_list: openId
                        },
                        method: "POST",
                        url: `${api.user.batchget}?access_token=${access_token}`
                    });
                } else {
                    Object.assign(options, {
                        url: `${api.user.get}?access_token=${access_token}&openid=${openId}&lang=${lang}`
                    });
                }
                requestPromise(options).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("batch get user fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    listUsers(openId) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                let url = `${api.user.list}?access_token=${access_token}`;
                if (openId) url = `${url}&next_openid=${openId}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("list users fails");
                }).catch(error => {
                    reject(error);
                });
            });
        }); 
    }
    createTag(name) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.create}?access_token=${access_token}`;
                const form = {
                    tag: {
                        name
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("create tag fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getTags() {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.get}?access_token=${access_token}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get tags fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    updateTag(id, name) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.update}?access_token=${access_token}`;
                const form = {
                    tag: {
                        id,
                        name
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("update tag fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    deleteTag(id) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.delete}?access_token=${access_token}`;
                const form = {
                    tag: {
                        id
                    }
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("delete tag fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getTagUsers(tagId, openId) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.tagUsers}?access_token=${access_token}`;
                const form = {
                    tagid: tagId
                };
                if (openId) form.next_openid = openId;
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get tag users fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    batchTag(openIds, tagId, unTag) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                let url = `${api.tag.batchtag}?access_token=${access_token}`;
                if (unTag) url = `${api.tag.batchuntag}?access_token=${access_token}`;
                const form = {
                    openid_list: openIds,
                    tagid: tagId
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("batch tag fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getUserTags(openId) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.tag.userTags}?access_token=${access_token}`;
                const form = {
                    openid: openId
                };
                requestPromise({
                    method: "POST",
                    url,
                    body: form,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get user tags fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    sendByTag(type, message, tagId) {
        const msg = {
            filter: {},
            msgtype: type
        };
        if (!tagId) {
            msg.filter.is_to_all = true;
        } else {
            Object.assign(msg.filter, {
                is_to_all: false,
                tag_id: tagId
            }); 
        }
        msg[type] = message;
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = data;
                const url = `${api.mass.tag}?access_token=${access_token}`;
                requestPromise({
                    method: "POST",
                    url,
                    body: msg,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("send to tag fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    createMenu(menu) {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                console.log("to create menu");
                const { access_token } = this;
                const url = `${api.menu.create}?access_token=${access_token}`;
                requestPromise({
                    method: "POST",
                    url,
                    body: menu,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("create menu fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getMenu() {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.menu.get}?access_token=${access_token}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get menu fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    deleteMenu() {
        return new Promise((resolve, reject) => {
            console.log("to delete menu");
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.menu.delete}?access_token=${access_token}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("delete menu fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    getCurrentMenu() {
        return new Promise((resolve, reject) => {
            this.fetchAccessToken().then(data => {
                const { access_token } = this;
                const url = `${api.menu.current}?access_token=${access_token}`;
                requestPromise({
                    url,
                    json: true
                }).then(response => {
                    const { body } = response;
                    if (body) resolve(body);
                    else throw new Error("get current menu fails");
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    fetchTicket(access_token) {
        this.getTicket().then(data => {
            try {
                data = JSON.parse(data);
                if (this.isValidTicket(data)) {
                    return Promise.resolve(data);
                } else {
                    return this.updateTicket(access_token);
                }
            } catch (error) {
                return this.updateTicket(access_token);
            }
        }).then(data => {
            this.saveTicket(data);
            return Promise.resolve(data);
        });
    }
    updateTicket(access_token) {
        const url = `${api.ticket.get}?access_token=${access_token}&type=jsapi`;
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
    isValidTicket(data) {
        if (!data || !data.ticket || !data.expires_in) return false;
        const { ticket, expires_in } = data;
        const now = new Date().getTime();
        return now < expires_in ? true : false;
    }
}

export default Wechat;
