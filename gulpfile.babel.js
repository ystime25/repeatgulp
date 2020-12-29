import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import connect from "gulp-connect";

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
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

const detectChange = () =>{
    console.log("Applying Modifications")
    gulp.watch(routes.pug.watch, pug)
};

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

const postDev = gulp.series([webserver, detectChange]);

export const dev = gulp.series([prepare, assets, postDev]);

