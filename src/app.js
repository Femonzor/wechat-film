import Koa from "koa";
import sha1 from "sha1";
import { join } from "path";
import auth from "./middleware/auth";
import { readFileAsync, writeFileAsync } from "./util/file";
import config from "./config";

const tokenFile = join(__dirname, "token.txt");
const options = {
    wechat: Object.assign({
        getAccessToken: () => readFileAsync(tokenFile),
        saveAccessToken: (content) => writeFileAsync(tokenFile, content)
    }, config)
};

const app = new Koa();

app.use(auth(options.wechat));

app.listen(9999);
console.log("Listening: 9999");
