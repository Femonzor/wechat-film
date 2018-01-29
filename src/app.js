import Koa from "koa";
import auth from "./middleware/auth";
import config from "./config";

const app = new Koa();

app.use(auth(config.wechat));

app.listen(9999);
console.log("Listening: 9999");
