import { join } from "path";
import Wechat from "./models/wechat";
import { readFileAsync, writeFileAsync } from "./utils/file";

const tokenFile = join(__dirname, "token.txt");
const ticketFile = join(__dirname, "ticket.txt");
const prefix = "https://api.weixin.qq.com/cgi-bin";

export const config = {
    wechat: {
        appId: "wxa388f3adf1a0e8a5",
        appSecret: "cc11b92b483f477267a1618d6e8b1872",
        // appId: "wx0281c9c831a2abdc",
        // appSecret: "d33a78c03d2217b6b484336503b1ee25",
        token: "ftxbtfj9j6nrippoqkl0v781",
        encodingAESKey: "RHJZRT1gaQWtvnMpOg0FJGH8xarQbN74wyboKrrs5kR",
        getAccessToken: () => readFileAsync(tokenFile),
        saveAccessToken: (content) => writeFileAsync(tokenFile, content),
        getTicket: () => readFileAsync(ticketFile),
        saveTicket: (content) => writeFileAsync(ticketFile, content)
    },
    api: {
        accessToken: `${prefix}/token?grant_type=client_credential`,
        temporary: {
            upload: `${prefix}/media/upload`,
            get: `${prefix}/media/get`
        },
        permanent: {
            uploadNews: `${prefix}/material/add_news`,
            uploadImg: `${prefix}/media/uploadimg`,
            uploadMaterial: `${prefix}/material/add_material`,
            get: `${prefix}/material/get_material`,
            delete: `${prefix}/material/del_material`,
            update: `${prefix}/material/update_news`,
            count: `${prefix}/material/get_materialcount`,
            batchget: `${prefix}/material/batchget_material`
        },
        group: {
            create: `${prefix}/groups/create`,
            get: `${prefix}/groups/get`,
            getId: `${prefix}/groups/getid`,
            update: `${prefix}/groups/update`,
            move: `${prefix}/groups/members/update`,
            batchupdate: `${prefix}/groups/members/batchupdate`,
            delete: `${prefix}/groups/delete`
        },
        tag: {
            create: `${prefix}/tags/create`,
            get: `${prefix}/tags/get`,
            update: `${prefix}/tags/update`,
            delete: `${prefix}/tags/delete`,
            tagUsers: `${prefix}/user/tag/get`,
            batchtag: `${prefix}/tags/members/batchtagging`,
            batchuntag: `${prefix}/tags/members/batchuntagging`,
            userTags: `${prefix}/tags/getidlist`
        },
        user: {
            remark: `${prefix}/user/info/updateremark`,
            get: `${prefix}/user/info`,
            batchget: `${prefix}/user/info/batchget`,
            list: `${prefix}/user/get`
        },
        mass: {
            tag: `${prefix}/message/mass/sendall`,
            openIds: `${prefix}/message/mass/send`,
            delete: `${prefix}/message/mass/delete`,
            preview: `${prefix}/message/mass/preview`,
            check: `${prefix}/message/mass/get`
        },
        menu: {
            create: `${prefix}/menu/create`,
            get: `${prefix}/menu/get`,
            delete: `${prefix}/menu/delete`,
            current: `${prefix}/get_current_selfmenu_info`
        },
        ticket: {
            get: `${prefix}/ticket/getticket`
        }
    }
};

export const getWechat = () => {
    const wechatApi = new Wechat(config.wechat);
    return wechatApi;
};
