import MovieApi from "../api/movie";

const index = async context => {
    const categories = await MovieApi.findAll();
    context.render("pages/index", {
        title: "电影首页",
        categories
    });
};

const search = async context => {
    const categoryId = context.query.cat;
    const page = context.query.p || 1;
    const q = context.query.q;
    const count = 2;
    const index = (page - 1) * count;
    if (categoryId) {
        const categories = await MovieApi.searchByCategory(categoryId);
        const category = categories[0] || {};
        const movies = category.movies || [];
        const results = movies.slice(index, index + count);
        context.render("pages/results", {
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
        context.render("pages/results", {
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
