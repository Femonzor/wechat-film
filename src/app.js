import Koa from "koa";
import Router from "koa-router";
import crypto from "crypto";
import mongoose from "mongoose";
import connectMongo from "connect-mongo";
import session from "koa-session";
import koaViews from "koa-views";
import game from "./controllers/game";
import menu from "./constants/menu";
import { getWechat, config } from "./wx";
import { hear } from "./controllers/wechat";
import User from "./models/user";

const wechatApi = getWechat();

wechatApi.deleteMenu().then(() => {
    return wechatApi.createMenu(menu);
}).then(message => {
    console.log(message);
});

const app = new Koa();
const router = new Router();
const mongoStore = connectMongo(session);
const dbUrl = "mongodb://localhost:27017/film";
mongoose.connect(dbUrl);
app.keys = ["film"];
app.use(session(app));

app.use(koaViews(__dirname + "/views", {
    extension: "handlebars",
    map: {
        handlebars: "handlebars"
    },
    options: {
        partials: {
            head: __dirname + "/views/partials/wechat_head"
        },
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

app.use(async (context, next) => {
    const user = context.session.user;
    if (user && user._id) {
        context.session.user = await User.findOne({ _id: user._id }).exec();
        context.state.user = context.session.user;
    } else {
        context.state.user = null;
    }
    await next();
});

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(9999);
console.log("Listening: 9999");
