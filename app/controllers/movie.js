import Movie from "../models/movie";
import Comment from "../models/comment";

const detail = (request, response) => {
    const id = request.params.id;
    Movie.findById(id, (error, movie) => {
        Comment
        .find({movie: id})
        .populate("from", "name")
        .exec((error, comments) => {
            response.render("pages/detail", {
                title: movie.title,
                movie,
                comments
            });
        });
    });
};

const create = (request, response) => {
    response.render("pages/admin", {
        title: "电影管理页",
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
};

const update = (request, response) => {
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
};

const save = (request, response) => {
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
};

const list = (request, response) => {
    Movie.fetch((error, movies) => {
        if (error) console.log(error);
        response.render("pages/list", {
            title: "电影列表页",
            movies
        })
    });
};

const del = (request, response) => {
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
};

export default {
    detail,
    create,
    update,
    save,
    list,
    del
};
