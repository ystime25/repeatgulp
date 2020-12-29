import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import connect from "gulp-connect";
import image from "gulp-image";

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src:"src/img/*",
        dest:"build/img"
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
    console.log("Applying Modifications")
    gulp.watch(routes.pug.watch, pug)
};

const img = () =>
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const postDev = gulp.series([webserver, detectChange]);

export const dev = gulp.series([prepare, assets, postDev]);

