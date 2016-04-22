'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var KarmaServer = require('karma').Server;
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');

// Run our karma tests
gulp.task('karma', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('build-css', function() {
  return gulp.src('client/styles/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(addsrc('bower_components/bootstrap/dist/css/bootstrap.min.css'))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('client/styles/'))
});

gulp.task('default', ['build-css']);

