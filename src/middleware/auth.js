"use strict";

import sha1 from "sha1";
import getRawBody from "raw-body";
import AccessToken from "../model/accessToken";
import { parseXMLAsync, formatMessage } from "../util/xml";
import { reply } from "../util/handle";

export default options => {
    const accessToken = new AccessToken(options);
    return async context => {
        const { token } = options;
        const { signature, nonce, timestamp, echostr } = context.query;
        const str = [token, timestamp, nonce].sort().join("");
        const sha = sha1(str);
        const { method } = context;
        if (method === "GET") {
            if (sha === signature) {
                context.body = echostr + "";
                console.log("success");
            } else {
                context.body = "wrong";
            }
        } else if (method === "POST") {
            if (sha !== signature) {
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
            console.log(message);
            reply(context, message);
            // if (message.MsgType === "event") {
            //     const now = new Date().getTime();
            //     if (message.Event === "subscribe") {
            //         Object.assign(context, {
            //             status: 200,
            //             type: "application/xml",
            //             body: `<xml><ToUserName><![CDATA[${message.FromUserName}]]></ToUserName><FromUserName><![CDATA[${message.ToUserName}]]></FromUserName><CreateTime>${now}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好！]]></Content></xml>`
            //         });
            //         return;
            //     }
            // }
        }
    };
};
