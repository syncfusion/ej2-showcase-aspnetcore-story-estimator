/// <binding BeforeBuild='css-clean, sass-to-css, clean-bundle, bundle-min, cache-burst-ts, copy-system-cache-buster' ProjectOpened='sass-to-css:watch' />
"use strict";
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    sass = require("gulp-sass")(require('sass')),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    del = require("del"),
    clean = require("gulp-clean"),
    gutil = require('gulp-util'),
    bundleconfig = require("./bundleconfig.json");
module.exports = gulp;
var window = {};
var fs = require('fs');

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

/* Gulp to convert all Scss to css while saving */
gulp.task('sass-to-css', function () {
    return gulp.src(['./wwwroot/css/**/*.scss',
         '!./wwwroot/css/Common/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./wwwroot/dist/css'));
});

gulp.task('sass-to-css:watch', function () {
    gulp.watch('./wwwroot/css/**/*.scss', ['sass-to-css']);
});

gulp.task('css-clean', function () {
    return gulp.src(['./wwwroot/dist/**/*.css',
        './wwwroot/dist/**/*.js',])
        .pipe(clean());
});

/*Minifying using Bundle*/
gulp.task('bundle-min', gulp.series(minjs, mincss));

gulp.task("min:js", minjs);
function minjs () {
    var tasks = getBundles(regex.js).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(uglify())
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
};
exports.minjs = minjs;

gulp.task("min:css", mincss);
function mincss() {
  var tasks = getBundles(regex.css).map(function (bundle) {
    return gulp.src(bundle.inputFiles, { base: "." })
      .pipe(concat(bundle.outputFileName))
      .pipe(cssmin())
      .pipe(gulp.dest("."));
  });
  return merge(tasks);
};
exports.mincss = mincss;

gulp.task("clean-bundle", function () {
    var files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    return del(files);
});

gulp.task("bundle-watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:js"]);
    });

    getBundles(regex.css).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:css"]);
    });
});

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}