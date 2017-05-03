/*jshint esversion: 6*/

var gulp = require('gulp');
var sass = require('gulp-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  gulp.watch("scss/**/*.scss", ['sass']);
  return gulp.src("scss/styles.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("public/css"));
});

gulp.task('default', ['sass']);