import Movie from "../models/movie";
import Category from "../models/category";

const findAll = async () => {
    const categories = await Category
        .find({})
        .populate({
            path: "movies",
            options: { limit: 5 }
        })
        .exec();
    return categories;
};

const searchByCategory = async categoryId => {
    const categories = await Category
        .find({ _id: categoryId })
        .populate({
            path: "movies",
            select: "title poster"
        })
        .exec();
    return categories;
};

const searchByName = async keyword => {
    try {
        const movies = await Movie
            .find({ title: new RegExp(keyword + ".*", "i") })
            .exec();
        return movies;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const searchByDouban = async keyword => {
    try {
        const movies = [];
        const response = await fetch(`https://api.douban.com/v2/movie/search?q=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        const { subjects } = data;
        if (subjects.length) {
            let queryArray = [];
            subjects.forEach(item => {
                queryArray.push(async () => {
                    let movie = await Movie.findOne({ doubanId: item.id });
                    if (!movie) {
                        const directors = item.directors || [];
                        const director = directors[0] || {};
                        movie = new Movie({
                            director: director.name || "",
                            title: item.title,
                            doubanId: item.id,
                            poster: item.images.large,
                            year: item.year,
                            genres: item.genres || []
                        });
                        movie = await movie.save();
                    }
                    movies.push(movie);
                });
            });
            await Promise.all(queryArray);
        }
        return movies;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default {
    findAll,
    searchByCategory,
    searchByName,
    searchByDouban
};
