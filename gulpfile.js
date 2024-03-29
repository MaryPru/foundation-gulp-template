import gulp from 'gulp';

import {path} from "./gulp/config/path.js"
import {copy} from "./gulp/tasks/copy.js";
import {reset} from "./gulp/tasks/reset.js";
import {html} from "./gulp/tasks/html.js";
import {plugins} from "./gulp/config/plugins.js";
import {server} from "./gulp/tasks/server.js";
import {scss} from "./gulp/tasks/scss.js";
import {img} from "./gulp/tasks/img.js";
import {js} from "./gulp/tasks/js.js";
import {otfToTtf, ttfToWoff, fontsStyle} from "./gulp/tasks/fonts.js";
import {svgSprive} from "./gulp/tasks/svgSrive.js";
import {zip} from './gulp/tasks/zip.js'
import {ftp} from './gulp/tasks/ftp.js'

global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path,
    gulp,
    plugins
}

function watcher() {
    gulp.watch(path.watch.files, copy)
    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.img, img)
    gulp.watch(path.watch.js, js)
}

export {svgSprive}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series( gulp.parallel(copy, html, scss, img, js))

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const deployZIP = gulp.series(reset, mainTasks, zip)
const deployFTP = gulp.series(reset, mainTasks, ftp)

//экспорт сценариев
export {dev}
export {build}
export {deployZIP}
export {deployFTP}

gulp.task('default', dev)