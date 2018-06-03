import IndexController from "../app/controllers/index";
import UserController from "../app/controllers/user";
import MovieController from "../app/controllers/movie";
import CommentController from "../app/controllers/comment";
import CategoryController from "../app/controllers/category";

export default router => {    
    router.get("/", IndexController.index);
    router.get("/results", IndexController.search);

    router.get("/movie/:id", MovieController.detail);
    router.get("/admin/movie/new", UserController.signinRequired, UserController.adminRequired, MovieController.create);
    router.get("/admin/movie/update/:id", UserController.signinRequired, UserController.adminRequired, MovieController.update);
    router.post("/admin/movie", UserController.signinRequired, UserController.adminRequired,
        upload.array("uploadPoster"), MovieController.savePoster, MovieController.save);
    router.get("/admin/movie/list", UserController.signinRequired, UserController.adminRequired, MovieController.list);
    router.delete("/admin/movie/list", UserController.signinRequired, UserController.adminRequired, MovieController.del);

    router.post("/user/signup", UserController.signup);
    router.get("/admin/user/list", UserController.signinRequired, UserController.adminRequired, UserController.list);
    router.post("/user/signin", UserController.signin);
    router.get("/signin", UserController.showSignin);
    router.get("/signup", UserController.showSignup);
    router.get("/logout", UserController.logout);

    router.post("/user/comment", UserController.signinRequired, CommentController.save);

    router.get("/admin/category/new", UserController.signinRequired, UserController.adminRequired, CategoryController.create);
    router.post("/admin/category", UserController.signinRequired, UserController.adminRequired, CategoryController.save);
    router.get("/admin/category/list", UserController.signinRequired, UserController.adminRequired, CategoryController.list);

    router.get("/wechat/movie", game.guess);
    router.get("/wechat/movie/:id", game.find);
    router.get("/wx", hear);
    router.post("/wx", hear);
};
