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

const search = (request, response) => {
    const categoryId = request.query.cat;
    const page = request.query.p || 1;
    const q = request.query.q;
    const count = 2;
    const index = (page - 1) * count;
    if (categoryId) {
        Category
        .find({ _id: categoryId })
        .populate({
            path: "movies",
            select: "title poster"
        })
        .exec((error, categories) => {
            if (error) console.log(error);
            const category = categories[0] || {};
            const movies = category.movies || [];
            const results = movies.slice(index, index + count);
            response.render("pages/results", {
                title: "结果列表页面",
                keyword: category.name,
                currentPage: page,
                query: `cat=${categoryId}`,
                totlePage: Math.ceil(movies.length / count),
                movies: results
            });
        });
    } else {
        Movie
        .find({ title: new RegExp(q + ".*", "i") })
        .exec((error, movies) => {
            if (error) console.log(error);
            const results = movies.slice(index, index + count);
            response.render("pages/results", {
                title: "结果列表页面",
                keyword: q,
                currentPage: page,
                query: `q=${q}`,
                totlePage: Math.ceil(movies.length / count),
                movies: results
            });
        });
    }
};

export default {
    index,
    search
};
