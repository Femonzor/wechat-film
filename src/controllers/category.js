import Category from "../models/category";

const create = async context => {
    response.render("pages/category_admin", {
        title: "电影分类管理页",
        category: {
            _id: "",
            name: ""
        }
    });
};

const save = async context => {
    const categoryData = context.request.body.category;
    const categoryObj = new Category(categoryData);
    categoryObj.save((error, category) => {
        if (error) console.log(error);
        context.redirect("/admin/category/list");
    });
    // if (_id) {
    //     Movie.findById(_id, (error, movie) => {
    //         if (error) console.log(error);
    //         movieObj = Object.assign(movie, movieData);
    //         movieObj.save((error, movie) => {
    //             if (error) console.log(error);
    //             context.redirect(`/movie/${movie._id}`);
    //         });
    //     });
    // } else {
    //     delete movieData._id;
    //     movieObj = new Movie(movieData);
    //     movieObj.save((error, movie) => {
    //         if (error) console.log(error);
    //         context.redirect(`/movie/${movie._id}`);
    //     });
    // }
};

const list = async context => {
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
