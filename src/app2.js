import express from "express";
import bodyParser from "body-parser";
import expressArtTemplate from "express-art-template";

const port = process.env.PORT || 9998;
const app = new express();

app.set("views", "views");
app.engine("art", expressArtTemplate);
app.set("view engine", "art");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("bower_components"));
app.listen(port);

console.log(`site started on port ${port}`);

app.get("/", (request, response) => {
    response.render("pages/index", {
        title: "imooc",
        movies: [{
            title: "机械战警",
            id: 1,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }, {
            title: "机械战警",
            id: 2,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }, {
            title: "机械战警",
            id: 3,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }, {
            title: "机械战警",
            id: 4,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }, {
            title: "机械战警",
            id: 5,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }, {
            title: "机械战警",
            id: 6,
            poster: "https://femonzor.com/resource/images/koala.jpg"
        }]
    });
});

app.get("/movie/:id", (request, response) => {
    response.render("pages/detail", {
        title: "imooc详细页",
        movie: {
            director: "帕迪利亚",
            country: "美国",
            title: "机械战警",
            year: 2014,
            poster: "https://femonzor.com/resource/images/koala.jpg",
            language: "英语",
            flash: "http://img-hws.y8.com/cloud/y8-rollover/videos/55953/785b538bd4db8ad9b5dd45e6950e1cb2e4135abb.swf",
            summary: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }
    });
});

app.get("/admin/movie", (request, response) => {
    response.render("pages/admin", {
        title: "imooc管理页",
        movie: {
            title: "",
            director: "",
            country: "",
            year: "",
            poster: "",
            flash: "",
            summary: "",
            language: ""
        }
    });
});

app.get("/admin/list", (request, response) => {
    response.render("pages/list", {
        title: "imooc列表页",
        movies: [{
            title: "机械战警",
            id: 1,
            director: "帕迪利亚",
            country: "美国",
            year: 2014,
            poster: "https://femonzor.com/resource/images/koala.jpg",
            language: "英语",
            flash: "http://img-hws.y8.com/cloud/y8-rollover/videos/55953/785b538bd4db8ad9b5dd45e6950e1cb2e4135abb.swf",
            summary: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"
        }]
    });
});
