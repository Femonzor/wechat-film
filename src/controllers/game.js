import { getWechat } from "../wx";
import config from "../config";
import sign from "../utils/sign";

const guess = async (context, next) => {
    const wechatApi = getWechat();
    const accessData = await wechatApi.fetchAccessToken();
    const { access_token } = accessData;
    const ticketData = await wechatApi.fetchTicket(access_token);
    const { ticket } = ticketData;
    const url = context.href;
    const params = sign.getSign(ticket, url);
    params.appId = config.wechat.appId;
    await context.render("wechat/game", params);
};

const find = async (context, next) => {
    const wechatApi = getWechat();
    const accessData = await wechatApi.fetchAccessToken();
    const { access_token } = accessData;
    const ticketData = await wechatApi.fetchTicket(access_token);
    const { ticket } = ticketData;
    const url = context.href;
    const params = getSign(ticket, url);
    await context.render("wechat/game", params);
};

export default {
    guess,
    find
};
