"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
// const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
// const webpackstream = require("webpack-stream");





// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
        baseDir: '_site'
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


// Clean assets
function clean() {
  return del(["./_site/assets/"]);
}


// CSS task
function css() {
  return gulp
    .src("_scss/jesstyles.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("/assets/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("/assets/css/"))
    .pipe(browsersync.stream());
}


// Lint scripts
// function scriptsLint() {
//   return gulp
//     .src(["/assets/js/*', '/assets/**/js/*"])
//     .pipe(plumber())
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// }

// // Transpile, concatenate and minify scripts
// function scripts() {
//   return (
//     gulp
//       .src(["/assets/js/**/*"])
//       .pipe(plumber())
//       .pipe(webpackstream(webpackconfig, webpack))
//       // folder only, filename is specified in webpack config
//       .pipe(gulp.dest("./_site/assets/js/"))
//       .pipe(browsersync.stream())
//   );
// }



// Jekyll
function jekyll() {
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("_scss/*.scss', '_scss/*/*.scss", css);
 // gulp.watch("/assets/js/*.js', '/assets/**/js/*.js", gulp.series(scriptsLint, scripts));
  gulp.watch(
    [
      "/_includes/**/*",
      "/_layouts/**/*",
      "/_site/**/*",
      "/_posts/**/*",

    ],
    gulp.series(jekyll, browserSyncReload)
  );
  
}


// define complex tasks
//const js = gulp.series(scriptsLint, scripts);
//const js = gulp.series(scriptsLint);
const build = gulp.series(clean, gulp.parallel(css, jekyll));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;
//exports.js = js;
exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
