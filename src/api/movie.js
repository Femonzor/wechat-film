import Movie from "../models/movie";
import Category from "../models/category";

const updateMovies = async movies => {
    try {
        console.log("start update movies");
        for (let movie of movies) {
            const response = await fetch(`https://api.douban.com/v2/movie/subject/${movie.doubanId}`);
            const data = await response.json();
            Object.assign(movie, {
                country: data.countries[0],
                language: data.language,
                summary: data.summary
            });
            const { genres } = movie;
            if (genres && genres.length) {
                const cateArray = [];
                for (let item of genres) {
                    cateArray.push((async () => {
                        let category = await Category.findOne({ name: item }).exec();
                        if (category) {
                            console.log("category exists:", category.name);
                            category.movies.push(movie._id);
                            await category.save();
                        } else {
                            console.log("category not exists:", item);
                            category = new Category({
                                name: item,
                                movies: [movie._id]
                            });
                            category = await category.save();
                            console.log("category saved:", item);
                            movie.category = category._id;
                            await movie.save();
                        }
                    })());
                };
                await Promise.all(cateArray);
            } else {
                await movie.save();
            }
        }
    } catch (error) {
        console.log(error);
    }
};

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

const searchById = async id => {
    try {
        const movie = await Movie
            .findOne({ _id: id })
            .exec();
        return movie;
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
                queryArray.push((async () => {
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
                })());
            });
            await Promise.all(queryArray);
            console.log("to update movies");
            updateMovies(movies);
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
    searchById,
    searchByDouban
};
