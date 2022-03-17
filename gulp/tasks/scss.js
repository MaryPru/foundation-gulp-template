import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from "gulp-rename"

import cleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer'
import groupCssMediaQueries from 'gulp-group-css-media-queries'

const sass = gulpSass(dartSass)

let sassPaths = [
    'node_modules/foundation-sites/scss'
];

export const scss = () => {
    return app.gulp.src(app.path.src.scss, {sourcemaps: app.isDev})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(app.plugins.replace(/@img\//g, './img/'))
        .pipe(sass({
            includePaths: sassPaths,
            outputStyle: 'compressed'
        }))
        .pipe(
            app.plugins.if(
                app.isBuild,
                groupCssMediaQueries()))
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpcss({
                    webpClass: '.webp',
                    noWebpClass: '.no-webp',
                })))
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ['last 3 versions'],
                    cascade: true
                })))
        //раскомментировать если нуен не сжатый файл стилей
        // .pipe(app.gulp.dest(app.path.build.css))
        .pipe(
            app.plugins.if(
                app.isBuild,
                cleanCss()))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream())
}