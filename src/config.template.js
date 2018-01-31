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
        accessTokenUrl: `${prefix}/token?grant_type=client_credential`,
        uploadUrl: `${prefix}/media/upload`
    }
};
