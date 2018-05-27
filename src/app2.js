import express from "express";
import bodyParser from "body-parser";
import expressHandlebars from "express-handlebars";
import mongoose from "mongoose";
import moment from "moment";
import connectMongo from "connect-mongo";
import session from "express-session";
import serveStatic from "serve-static";
import morgan from "morgan";
import routes from "../config/routes";

const port = process.env.PORT || 9998;
const app = new express();
const mongoStore = connectMongo(session);
const dbUrl = "mongodb://localhost:27017/film";
mongoose.connect(dbUrl);

app.set("views", "app/views");
app.engine("handlebars", expressHandlebars({
    layoutsDir: app.get("views") + "/layouts",
    defaultLayout: "layout",
    partialsDir: app.get("views") + "/partials",
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
        myif: function (conditional, options) {
            if (conditional) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: "film",
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl
    })
}));

if (app.get("env") === "development") {
    app.set("showStackError", true);
    app.use(morgan(":method :url :status"));
    mongoose.set("debug", true);
}

routes(app);

app.use(serveStatic("public"));
app.listen(port);

console.log(`site started on port ${port}`);
