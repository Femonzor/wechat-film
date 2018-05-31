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
    const movies = await Movie
        .find({ title: new RegExp(keyword + ".*", "i") })
        .exec();
    return movies;
};

const searchByDouban = async keyword => {
    
};

export default {
    findAll,
    searchByCategory,
    searchByName
};
