"use strict";

import Koa from "koa";
import sha1 from "sha1";
import { join } from "path";
import auth from "./middleware/auth";
import { readFileAsync, writeFileAsync } from "./util/file";

const tokenFile = join(__dirname, "token.txt");
const config = {
    wechat: {
        appId: "wxa388f3adf1a0e8a5",
        appSecret: "cc11b92b483f477267a1618d6e8b1872",
        token: "ftxbtfj9j6nrippoqkl0v781",
        getAccessToken: () => readFileAsync(tokenFile),
        saveAccessToken: (content) => writeFileAsync(tokenFile, content)
    }
};

const app = new Koa();

// app.use(function* (next) {
//     console.log("haha");
//     console.log(this.query);
// });

app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999"); 