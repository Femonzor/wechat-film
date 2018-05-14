import express from "express";
import expressArtTemplate from "express-art-template";

const port = process.env.PORT || 9998;
const app = new express();

app.set("views", "views");
app.engine("art", expressArtTemplate);
app.set("view engine", "art");
app.listen(port);

console.log(`site started on port ${port}`);

app.get("/", (request, response) => {
    response.render("pages/index", {
        title: "imooc"
    });
});

app.get("/movie/:id", (request, response) => {
    response.render("pages/detail", {
        title: "imooc详细页"
    });
});

app.get("/admin/movie", (request, response) => {
    response.render("pages/admin", {
        title: "imooc管理页"
    });
});

app.get("/admin/list", (request, response) => {
    response.render("pages/list", {
        title: "imooc列表页"
    });
});
