import express from "express";
import bodyParser from "body-parser";
import expressArtTemplate from "express-art-template";
import mongoose from "mongoose";
import moment from "moment";
import connectMongo from "connect-mongo";
import session from "express-session";
import Movie from "../models/movie";
import User from "../models/user";

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
app.use(express.static("public"));
app.locals.moment = moment;
app.listen(port);

console.log(`site started on port ${port}`);

app.get("/", (request, response) => {
    console.log(request.session.user);
    Movie.fetch((error, movies) => {
        if (error) console.log(error);
        response.render("pages/index", {
            title: "电影首页",
            movies
        })
    });
});

app.get("/movie/:id", (request, response) => {
    const id = request.params.id;
    Movie.findById(id, (error, movie) => {
        response.render("pages/detail", {
            title: movie.title,
            movie
        });
    });
});

app.get("/admin/movie", (request, response) => {
    response.render("pages/admin", {
        title: "imooc管理页",
        movie: {
            _id: "",
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

app.get("/admin/update/:id", (request, response) => {
    const id = request.params.id;
    if (id) {
        Movie.findById(id, (error, movie) => {
            if (error) console.log(error);
            response.render("pages/admin", {
                title: "imooc管理页",
                movie
            });
        });
    }
});

app.post("/admin/movie/new", (request, response) => {
    const movieData = request.body.movie;
    const { _id } = movieData;
    let movieObj;
    if (_id) {
        Movie.findById(_id, (error, movie) => {
            if (error) console.log(error);
            movieObj = Object.assign(movie, movieData);
            movieObj.save((error, movie) => {
                if (error) console.log(error);
                response.redirect(`/movie/${movie._id}`);
            });
        });
    } else {
        delete movieData._id;
        movieObj = new Movie(movieData);
        movieObj.save((error, movie) => {
            if (error) console.log(error);
            response.redirect(`/movie/${movie._id}`);
        });
    }
});

app.get("/admin/list", (request, response) => {
    Movie.fetch((error, movies) => {
        if (error) console.log(error);
        response.render("pages/list", {
            title: "电影列表页",
            movies
        })
    });
});

app.delete("/admin/list", (request, response) => {
    const id = request.query.id;
    if (id) {
        Movie.remove({ _id: id }, (error, movie) => {
            if (error) {
                console.log(error);
            } else {
                response.json({ success: 1 });
            }
        });
    }
});

app.post("/user/signup", (request, response) => {
    const userData = request.body.user;
    const user = new User(userData);
    User.findOne({ name: userData.name }, (error, user) => {
        if (error) console.log(error);
        if (user) return response.redirect("/");
        user.save((error, user) => {
            if (error) console.log(error);
            console.log(user);
            response.redirect("/admin/userlist");
        });
    });
});

app.get("/admin/userlist", (request, response) => {
    User.fetch((error, users) => {
        if (error) console.log(error);
        response.render("pages/userlist", {
            title: "用户列表页",
            users
        });
    });
});

app.post("/user/signin", (request, response) => {
    const userData = request.body.user;
    const { name, password } = userData;
    User.findOne({ name }, (error, user) => {
        if (error) console.log(error);
        if (!user) {
            return response.redirect("/");
        }
        user.comparePassword(password, (error, isMatch) => {
            if (error) console.log(error);
            if (isMatch) {
                request.session.user = user;
                return response.redirect("/");
            }
            console.log("Password is not matched");
        });
    });
});
