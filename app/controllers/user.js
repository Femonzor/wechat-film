import User from "../models/user";

const signup = (request, response) => {
    const userData = request.body.user;
    const user = new User(userData);
    User.findOne({ name: userData.name }, (error, user) => {
        if (error) console.log(error);
        if (user) return response.redirect("/signin");
        user.save((error, user) => {
            if (error) console.log(error);
            console.log(user);
            response.redirect("/");
        });
    });
};

const list = (request, response) => {
    User.fetch((error, users) => {
        if (error) console.log(error);
        response.render("pages/userlist", {
            title: "用户列表页",
            users
        });
    });
};

const signin = (request, response) => {
    const userData = request.body.user;
    const { name, password } = userData;
    User.findOne({ name }, (error, user) => {
        if (error) console.log(error);
        if (!user) {
            return response.redirect("/signup");
        }
        user.comparePassword(password, (error, isMatch) => {
            if (error) console.log(error);
            if (isMatch) {
                request.session.user = user;
                return response.redirect("/");
            } else {
                return response.redirect("/signin");
            }
        });
    });
};

const logout = (request, response) => {
    delete request.session.user;
    response.redirect("/");
};

const showSignin = (request, response) => {
    response.render("pages/signin", {
        title: "登录页面",
    });
};

const showSignup = (request, response) => {
    response.render("pages/signup", {
        title: "注册页面",
    });
};

export default {
    signup,
    list,
    signin,
    logout,
    showSignin,
    showSignup
};
