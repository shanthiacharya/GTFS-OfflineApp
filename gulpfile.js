
var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
//var eslint = require('gulp-eslint');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default',['copy-html','scripts','copy-css'],function(){

    console.log('Gulp is running correctly')
    gulp.watch('*.html', ['copy-html']);
    gulp.watch('./dist/**/*.*').on('change', browserSync.reload);

    browserSync.init({
        server: './dist'
    });
});

gulp.task('copy-html', function() {

    console.log('Gulp is copying html')
    gulp.src('./*.html')
        .pipe(gulp.dest('./dist'));
});
gulp.task('copy-css', function() {

    console.log('Gulp is copying css')
    gulp.src('css/**/*.css')
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('dist', [
    'copy-html',
    'scripts',
    'copy-css'

]);



gulp.task('scripts', function() {
    console.log('Gulp is copying/uglifying js')
    gulp.src('js/**/*.js')
         .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
