"use strict";

import gulp from "gulp";
import mocha from "gulp-mocha";
import babel from "babel-register";
import browserSync from "browser-sync";
import nodemon from "nodemon";
import should from "should";

const { reload } = browserSync;

gulp.task("node", () => {
    nodemon({
        script: "./index2.js",
        ext: "js art",
        env: {
            "NODE_EVN": "development"
        }
    });
});

gulp.task("server", ["node"], () => {
    const files = [
        "app/models/**/*.js",
        "app/schemas/**/*.js",
        "src/app2.js"
    ];
    const staticFiles = [
        "public/**/*.*",
        "app/views/**/*.handlebars"
    ];
    browserSync.init(files, {
        proxy: "http://localhost:9998",
        notify: false,
        port: 9997,
        reloadDelay: 1500
    });
    gulp.watch(staticFiles).on("change", browserSync.reload);
});

gulp.task("test", () => {
    return gulp.src(["test/**/*.js"], { read: false })
        .pipe(mocha({
            reporter: "spec",
            require: ["babel-core/register"]
        }));
});
