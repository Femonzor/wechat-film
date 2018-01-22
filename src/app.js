"use strict";

import Koa from "koa";
import sha1 from "sha1";
import auth from "./middleware/auth";

const config = {
    wechat: {
        appId: "wxa388f3adf1a0e8a5",
        appSecret: "cc11b92b483f477267a1618d6e8b1872",
        token: "ftxbtfj9j6nrippoqkl0v781"
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