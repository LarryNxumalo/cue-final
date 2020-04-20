'use-strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

gulp.task('sass-dev', () => {
    return gulp.src('resources/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('sass-prod', () => {
    return gulp.src('resources/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('copy', (done) => {
    gulp.src(['resources/images/**/*']).pipe(gulp.dest('dist/img'));
    gulp.src(['resources/fonts/**/*']).pipe(gulp.dest('dist/fonts'));
    gulp.src(['*.html']).pipe(gulp.dest('dist/'));

    done();
});

gulp.task('clean', () => {
    return gulp.src('dist/', { read: false })
        .pipe(clean());
});

gulp.task('build', gulp.series('copy', 'sass-dev'));

gulp.task('serve', gulp.series('build', (done) => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });

    gulp.watch('resources/scss/**/*.scss', gulp.task('sass-dev')).on('change', browserSync.reload);

    done();
}));

gulp.task('default', gulp.series('build'));