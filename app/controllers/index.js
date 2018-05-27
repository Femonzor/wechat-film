import Movie from "../models/movie";
import Category from "../models/category";

const index = (request, response) => {
    Category
    .find({})
    .populate({
        path: "movies",
        options: { limit: 5 }
    })
    .exec((error, categories) => {
        if (error) console.log(error);
        response.render("pages/index", {
            title: "电影首页",
            categories
        });
    });
};

export default {
    index
};
