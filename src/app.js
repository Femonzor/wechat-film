import Koa from "koa";
import Router from "koa-router";
import crypto from "crypto";
import koaViews from "koa-views";
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

app.use(koaViews(__dirname + "/views", {
    extension: "handlebars",
    map: {
        handlebars: "handlebars"
    },
    options: {
        helpers: {
            block: function (name) {
                var blocks = this._blocks,
                    content = blocks && blocks[name];
                return content ? content.join("\n") : null;
            },
            contentFor: function (name, options) {
                console.log("name:", name);
                var blocks = this._blocks || (this._blocks = {}),
                    block = blocks[name] || (blocks[name] = []);
                return block.push(options.fn(this));
            },
            moment: function (time, format) {
                return moment(time).format(format);
            },
            compare: function (left, right, status) {
                left += "";
                right += "";
                var result = left === right;
                if (typeof status === "string") result = result ? status : "";
                return result;
            },
            for: function (from, to, increase, options) {
                var blocks = "";
                for (var i = from; i <= to; i += increase) blocks += options.fn(i);
                return blocks;
            },
            gt: function (left, right) {
                return left > right;
            },
            contain: function (el, part) {
                return el.indexOf(part) > -1;
            }
        }
    }
}));

app
    .use(router.routes())
    .use(router.allowedMethods());
router.get("/movie", game.movie);
router.get("/wx", hear);
router.post("/wx", hear);

// app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999");
