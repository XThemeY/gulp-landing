const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const sassGlob = require('gulp-sass-glob')
const pug = require('gulp-pug')
const del = require('del')

gulp.task('pug', function () {
	return gulp.src('./src/pug/pages/**/*.pug')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./build/'))
		.pipe(browserSync.stream())
})

gulp.task('scss', function () {
	return gulp.src('./src/scss/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'Scss',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(sassGlob())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/css/'))
		.pipe(browserSync.stream())
})

//Копирование изображений
gulp.task('copy:img', function () {
	return gulp.src('./src/img/**/*.*')
		.pipe(gulp.dest('./build/img/'))
		.pipe(browserSync.stream())
})

//Копирование скриптов
gulp.task('copy:js', function () {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest('./build/js/'))
		.pipe(browserSync.stream())
})

//Копирование библиотек
gulp.task('copy:libs', function () {
	return gulp.src('./src/libs/**/*.*')
		.pipe(gulp.dest('./build/libs/'))
		.pipe(browserSync.stream())
})

//Слежение за изменением файлов
gulp.task('watch', function () {

	watch('./src/scss/**/*.scss', function () {
		setTimeout(gulp.parallel('scss'), 500)
	})
	watch('./src/pug/**/*.pug', gulp.parallel('pug'));
	watch('./src/img/**/*.*', gulp.parallel('copy:img'));
	watch('./src/js/**/*.*', gulp.parallel('copy:js'));
	watch('./src/libs/**/*.*', gulp.parallel('copy:libs'));
})

//Запуск сервера
gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	})
})

//Очищение папки Build
gulp.task('del', function () {
	return del('./build/')
})

//Задача по умолчанию
gulp.task('default',
	gulp.series(
		gulp.parallel('del'),
		gulp.parallel('scss', 'pug', 'copy:img', 'copy:js', 'copy:libs'),
		gulp.parallel('server', 'watch')))