import { getReplyObject } from "./object";

/**
 * 公众号回复消息（箭头函数要改变上下文必须通过变量传入，不能用call）
 * @param {Ojbect} context koa context上下文
 * @param {Object} message 微信消息对象
 */
export const reply = async (context, message) => {
    const obj = await getReplyObject(message);
    if (obj) {
        const xml = obj.toXML();
        console.log(`xml: ${xml}`);
        Object.assign(context, {
            status: 200,
            type: "application/xml",
            body: xml
        });
    }
};
