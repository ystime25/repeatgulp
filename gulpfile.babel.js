import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import connect from "gulp-connect";
import image from "gulp-image";
import sass from "gulp-sass";
import autoPrefix from "gulp-autoprefixer"
import minifyCSS from "gulp-csso";
import browserify from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

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
    },
    js: {
        watch: "src/js/**/*.js",
        src:"src/js/main.js",
        dest:"build/js"
    }
};

const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gulpPug())
        .pipe(gulp.dest(routes.pug.dest))
        .pipe(connect.reload());

const clean = () => del(["build/", ".publish"]);

const webserver = () => {
    console.log("Server Activation Comfirmed")
    connect.server({
        root: "build",
        livereload: true,
        port: 8001
    })
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

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(browserify({
            transform: [
                babelify.configure({ presets: ["@babel/preset-env"]}),
                ["uglifyify", { global: true}]
            ]
        }))
        .pipe(gulp.dest(routes.js.dest));

const ghDeploy = () => 
    gulp
        .src("build/**/*")
        .pipe(ghPages());


const detectChange = () => {
    console.log("Applying Modifications");
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.series([webserver, detectChange]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghDeploy, clean]);