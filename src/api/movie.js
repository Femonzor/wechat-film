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
        const response = await fetch(`https://api.douban.com/v2/movie/search?q=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        const { subjects } = data;
        return subjects;
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
