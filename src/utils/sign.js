import crypto from "crypto";

const createNonce = () => Math.random().toString(36).substr(2, 15);
const createTimestamp = () => (parseInt(new Date().getTime() / 1000, 10) + "");

const sign = (noncestr, ticket, timestamp, url) => {
    const params = [
        "noncestr=" + noncestr,
        "jsapi_ticket=" + ticket,
        "timestamp=" + timestamp,
        "url=" + url
    ];
    const str = params.sort().join("&");
    const shasum = crypto.createHash("sha1");
    shasum.update(str);
    return shasum.digest("hex");
};

const getSign = (ticket, url) => {
    const noncestr = createNonce();
    const timestamp = createTimestamp();
    const signature = sign(noncestr, ticket, timestamp, url);
    console.log("ticket: %s, url: %s", ticket, url);
    return {
        noncestr,
        timestamp,
        signature
    };
};

export default {
    getSign
};
