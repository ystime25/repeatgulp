import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import connect from "gulp-connect";
import image from "gulp-image";
import sass from "gulp-sass";
import autoPrefix from "gulp-autoprefixer"
import minifyCSS from "gulp-csso";

sass.compiler = require("node-sass"); 

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src:"src/img/*",
        dest:"build/img"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src:"src/scss/style.scss",
        dest:"build/css"
    }
};

const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gulpPug())
        .pipe(gulp.dest(routes.pug.dest))
        .pipe(connect.reload());

const clean = () => del(["build/"]);

const webserver = () => {
    console.log("Server Activation Comfirmed")
    connect.server({
        root: "build",
        livereload: true,
        port: 8001
    })
};

const detectChange = () => {
    console.log("Applying Modifications");
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, styles);
};

const img = () =>
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoPrefix())
        .pipe(minifyCSS())
        .pipe(gulp.dest(routes.scss.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const postDev = gulp.series([webserver, detectChange]);

export const dev = gulp.series([prepare, assets, postDev]);


