import MovieApi from "../api/movie";

const index = async (context, next) => {
    const categories = await MovieApi.findAll();
    context.render("pages/index", {
        title: "电影首页",
        categories
    });
};

const search = async (request, response) => {
    const categoryId = request.query.cat;
    const page = request.query.p || 1;
    const q = request.query.q;
    const count = 2;
    const index = (page - 1) * count;
    if (categoryId) {
        const categories = await MovieApi.searchByCategory(categoryId);
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
    } else {
        const movies = await MovieApi.searchByName(q);
        const results = movies.slice(index, index + count);
        response.render("pages/results", {
            title: "结果列表页面",
            keyword: q,
            currentPage: page,
            query: `q=${q}`,
            totlePage: Math.ceil(movies.length / count),
            movies: results
        });
    }
};

export default {
    index,
    search
};
