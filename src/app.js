import Koa from "koa";
import Router from "koa-router";
import crypto from "crypto";
import auth from "./middlewares/auth";
import Wechat from "./models/wechat";

import game from "./controllers/game";

import menu from "./constants/menu";
import { getWechat, config } from "./wx";
import { hear } from "./controllers/wechat";
const wechatApi = getWechat();

wechatApi.deleteMenu().then(() => {
    return wechatApi.createMenu(menu);
}).then(message => {
    console.log(message);
});

const app = new Koa();
const router = new Router();

app
    .use(router.routes())
    .use(router.allowedMethods());
router.get("/movie", game.movie);
router.get("/wx", hear);
router.post("/wx", hear);

// app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999");
