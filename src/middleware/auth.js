"use strict";

import sha1 from "sha1";

export default opts => ctx => {
    const { token } = opts;
    const { signature, nonce, timestamp, echostr } = ctx.query;
    const str = [token, timestamp, nonce].sort().join("");
    const sha = sha1(str);
    if (sha === signature) {
        ctx.body = echostr + "";
        console.log("success");
    } else {
        ctx.body = "wrong";
    }
};