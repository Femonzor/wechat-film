import IndexController from "../app/controllers/index";
import UserController from "../app/controllers/user";
import MovieController from "../app/controllers/movie";

export default app => {
    app.use((request, response, next) => {
        const user = request.session.user;
        app.locals.user = user;
        return next();
    });
    
    app.get("/", IndexController.index);

    app.get("/movie/:id", MovieController.detail);
    app.get("/admin/new", MovieController.create);
    app.get("/admin/update/:id", MovieController.update);
    app.post("/admin/movie", MovieController.save);
    app.get("/admin/list", MovieController.list);
    app.delete("/admin/list", MovieController.del);

    app.post("/user/signup", UserController.signup);
    app.get("/admin/userlist", UserController.list);
    app.post("/user/signin", UserController.signin);
    app.get("/signin", UserController.showSignin);
    app.get("/signup", UserController.showSignup);
    app.get("/logout", UserController.logout);    
};
