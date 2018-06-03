
import fs from "fs";
import path from "path";
import Movie from "../models/movie";
import Comment from "../models/comment";
import Category from "../models/category";

const detail = async context => {
    const id = request.params.id;
    const movie = await Movie.findById(id).exec();
    if (movie) {
        await Movie.update({ _id: id }, { $inc: { pv: 1 } });
        const comments = await Comment
            .find({movie: id})
            .populate("from", "name")
            .populate("replys.from replys.to", "name")
            .exec();
        await context.render("pages/detail", {
            title: movie.title,
            movie,
            comments
        });
    }
};

const create = async context => {
    const categories = await Category.find({}).exec();
    await context.render("pages/admin", {
        title: "电影管理页",
        categories,
        movie: {}
    });
};

const update = async context => {
    const id = request.params.id;
    if (id) {
        const movie = await Movie.findById(id).exec();
        const categories = await Category.find({}).exec();
        await response.render("pages/admin", {
            title: "电影管理页",
            movie,
            categories
        });
    }
};

const save = async context => {
    const movieData = context.request.body.movie;
    const { _id } = movieData;
    let movieObj;
    if (request.poster) movieData.poster = request.poster;
    if (_id) {
        let movie = await Movie.findById(_id).exec();
        movieObj = Object.assign(movie, movieData);
        movie = await movieObj.save();
        context.redirect(`/movie/${movie._id}`);
    } else {
        delete movieData._id;
        movieObj = new Movie(movieData);
        const categoryId = movieData.category;
        const categoryName = movieData.categoryName;
        let movie = await movieObj.save();
        let category;
        if (categoryId) {
            category = await Category.findById(categoryId).exec();
            category.movies.push(movie._id);
            await category.save();
            context.redirect(`/movie/${movie._id}`);
        } else {
            category = new Category({
                name: categoryName,
                movies: [movie._id]
            });
            category = await category.save();
            movie.category = category._id;
            movie = await movie.save();
            context.redirect(`/movie/${movie._id}`);
        }
    }
};

const list = async context => {
    const movies = await Movie.find({}).sort("meta.updateAt").exec();
    await context.render("pages/list", {
        title: "电影列表页",
        movies
    });
};

const del = async context => {
    const id = context.query.id;
    if (id) {
        const movie = await Movie.remove({ _id: id }).exec();
        context.body = { success: 1 };
    }
};

const savePoster = async (context, next) => {
    // const posterData = request.files[0];
    // const filePath = posterData.path;
    // const { originalname } = posterData;
    // if (originalname) {
    //     fs.readFile(filePath, (error, data) => {
    //         const timeStamp = Date.now();
    //         const type = posterData.mimetype.split("/")[1];
    //         const poster = timeStamp + "." + type;
    //         const newPath = path.join(__dirname, "../../", `/public/upload/${poster}`);
    //         fs.writeFile(newPath, data, error => {
    //             request.poster = poster;
    //             next();
    //         });
    //     });
    // } else {
    //     next();
    // }
};

export default {
    detail,
    create,
    update,
    save,
    list,
    del,
    savePoster
};
