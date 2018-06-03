import { getWechat } from "../wx";
import config from "../config";
import sign from "../utils/sign";
import MovieApi from "../api/movie";

const guess = async context => {
    const wechatApi = getWechat();
    const accessData = await wechatApi.fetchAccessToken();
    const { access_token } = accessData;
    const ticketData = await wechatApi.fetchTicket(access_token);
    const { ticket } = ticketData;
    const url = context.href;
    const params = sign.getSign(ticket, url);
    params.appId = config.wechat.appId;
    params.title = "猜电影";
    await context.render("wechat/game", params);
};

const find = async context => {
    const movie = await MovieApi.searchById(context.params.id);
    await context.render("wechat/movie", {
        movie
    });
};

export default {
    guess,
    find
};
