import express from "express";
import bodyParser from "body-parser";
import expressArtTemplate from "express-art-template";
import mongoose from "mongoose";
import moment from "moment";
import connectMongo from "connect-mongo";
import session from "express-session";
import morgan from "morgan";
import routes from "../config/routes";

const port = process.env.PORT || 9998;
const app = new express();
const mongoStore = connectMongo(session);
const dbUrl = "mongodb://localhost:27017/film";
mongoose.connect(dbUrl);

app.set("views", "views");
app.engine("art", expressArtTemplate);
app.set("view engine", "art");
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
    app.locals.pretty = true;
    mongoose.set("debug", true);
}

routes(app);

app.use(express.static("public"));
app.locals.moment = moment;
app.listen(port);

console.log(`site started on port ${port}`);
