import auth from "../middlewares/auth";
import { config } from "../wx";

export const hear = async context => {
    await auth(config.wechat)(context);
};
