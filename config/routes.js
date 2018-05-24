import IndexController from "../app/controllers/index";
import UserController from "../app/controllers/user";
import MovieController from "../app/controllers/movie";
import CommentController from "../app/controllers/comment";

export default app => {
    app.use((request, response, next) => {
        const user = request.session.user;
        app.locals.user = user;
        return next();
    });
    
    app.get("/", IndexController.index);

    app.get("/movie/:id", MovieController.detail);
    app.get("/admin/movie/new", UserController.signinRequired, UserController.adminRequired, MovieController.create);
    app.get("/admin/movie/update/:id", UserController.signinRequired, UserController.adminRequired, MovieController.update);
    app.post("/admin/movie", UserController.signinRequired, UserController.adminRequired, MovieController.save);
    app.get("/admin/movie/list", UserController.signinRequired, UserController.adminRequired, MovieController.list);
    app.delete("/admin/movie/list", UserController.signinRequired, UserController.adminRequired, MovieController.del);

    app.post("/user/signup", UserController.signup);
    app.get("/admin/user/list", UserController.signinRequired, UserController.adminRequired, UserController.list);
    app.post("/user/signin", UserController.signin);
    app.get("/signin", UserController.showSignin);
    app.get("/signup", UserController.showSignup);
    app.get("/logout", UserController.logout);

    app.post("/user/comment", UserController.signinRequired, CommentController.save);
};
