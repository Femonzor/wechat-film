import Movie from "../models/movie";

const index = (request, response) => {
    Movie.fetch((error, movies) => {
        if (error) console.log(error);
        response.render("pages/index", {
            title: "电影首页",
            movies
        });
    });
};

export default {
    index
};
