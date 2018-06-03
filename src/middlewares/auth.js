"use strict";

import sha1 from "sha1";
import getRawBody from "raw-body";
import Wechat from "../models/wechat";
import { parseXMLAsync, formatMessage } from "../utils/xml";
import { reply } from "../utils/handle";

export default options => {
    const accessToken = new Wechat(options);
    // console.log("accessToken:", accessToken);
    return async context => {
        const { token } = options;
        const { signature, nonce, timestamp, echostr } = context.query;
        const str = [token, timestamp, nonce].sort().join("");
        const sha = sha1(str);
        const { method } = context;
        if (method === "GET") {
            console.log("get request");
            if (sha === signature) {
                context.body = echostr + "";
                console.log("success");
            } else {
                console.log("get wrong");
                context.body = "wrong";
            }
        } else if (method === "POST") {
            console.log("post request");
            if (sha !== signature) {
                console.log("post wrong");
                context.body = "wrong";
                return false;
            }
            const data = await getRawBody(context.req, {
                length: context.request.length,
                limit: "1mb",
                encoding: context.request.charset
            });
            const content = await parseXMLAsync(data);
            const message = formatMessage(content.xml);
            // console.log(message);
            await reply(context, message);
        }
    };
};
