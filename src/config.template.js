import { join } from "path";
import { readFileAsync, writeFileAsync } from "./util/file";

const tokenFile = join(__dirname, "token.txt");
const prefix = "https://api.weixin.qq.com/cgi-bin";

export default {
    wechat: {
        appId: "wxa388f3adf1a0e8a5",
        appSecret: "cc11b92b483f477267a1618d6e8b1872",
        token: "ftxbtfj9j6nrippoqkl0v781",
        getAccessToken: () => readFileAsync(tokenFile),
        saveAccessToken: (content) => writeFileAsync(tokenFile, content)
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
        user: {
            remark: `${prefix}/user/info/updateremark`
        }
    }
};
