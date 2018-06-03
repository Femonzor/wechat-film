import User from "../models/user";

const signup = async context => {
    const userData = context.request.body.user;
    let user = new User(userData);
    user = await User.findOne({ name: userData.name }).exec();
    if (user) {
        context.redirect("/signin");
    } else {
        user = await user.save();
        console.log(user);
        context.redirect("/");
    }
};

const signin = async context => {
    const userData = context.request.body.user;
    const { name, password } = userData;
    let user = await User.findOne({ name }).exec();
    if (!user) {
        context.redirect("/signup");
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
        request.session.user = user;
        context.redirect("/");
    } else {
        context.redirect("/signin");
    }
};

const list = async context => {
    const users = await User.find({}).sort("meta.updateAt").exec();
    response.render("pages/userlist", {
        title: "用户列表页",
        users
    });
};

const logout = async context => {
    delete context.session.user;
    context.redirect("/");
};

const showSignin = async context => {
    response.render("pages/signin", {
        title: "登录页面",
    });
};

const showSignup = async context => {
    response.render("pages/signup", {
        title: "注册页面",
    });
};

const signinRequired = async (context, next) => {
    const user = request.session.user;
    if (!user) {
        context.redirect("/signin");
    } else {
        await next();
    }
};

const adminRequired = (context, next) => {
    const user = request.session.user;
    if (user.role <= 10) {
        context.redirect("/signin");
    } else {
        await next();
    }
};

export default {
    signup,
    list,
    signin,
    logout,
    showSignin,
    showSignup,
    signinRequired,
    adminRequired
};
