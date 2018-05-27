import Category from "../models/category";

const create = (request, response) => {
    response.render("pages/category_admin", {
        title: "电影分类管理页",
        category: {
            _id: "",
            name: ""
        }
    });
};

const save = (request, response) => {
    const categoryData = request.body.category;
    const categoryObj = new Category(categoryData);
    categoryObj.save((error, category) => {
        if (error) console.log(error);
        response.redirect("/admin/category/list");
    });
    // if (_id) {
    //     Movie.findById(_id, (error, movie) => {
    //         if (error) console.log(error);
    //         movieObj = Object.assign(movie, movieData);
    //         movieObj.save((error, movie) => {
    //             if (error) console.log(error);
    //             response.redirect(`/movie/${movie._id}`);
    //         });
    //     });
    // } else {
    //     delete movieData._id;
    //     movieObj = new Movie(movieData);
    //     movieObj.save((error, movie) => {
    //         if (error) console.log(error);
    //         response.redirect(`/movie/${movie._id}`);
    //     });
    // }
};

const list = (request, response) => {
    Category.fetch((error, categories) => {
        if (error) console.log(error);
        response.render("pages/categorylist", {
            title: "电影分类列表页",
            categories
        });
    });
};

export default {
    create,
    save,
    list
};
