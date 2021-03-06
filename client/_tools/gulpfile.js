/*global require*/
"use strict"

// gulp --type release

var gulp = require("gulp"),
	less = require('gulp-less'),
	path = require('path'),
	uglify = require('gulp-uglify'),
	minifyCSS = require('gulp-minify-css'),
	concat = require("gulp-concat"),
	karma = require('gulp-karma'),
	isMin;

function getLibs() {
	var min = isMin ? ".min" : "";
	return [
		'../libs/angular/angular' + min + '.js',
		'../libs/angular/angular-resource' + min + '.js',
		'../libs/moment/moment-with-langs.min.js',
		'../libs/react/react.js',
		'../libs/react/JSXTransformer.js',
//		'../libs/js/angular-route' + min + '.js',
//		'../libs/js/angular-animate' + min + '.js',
//		'../libs/js/angular-resource' + min + '.js',
//		'../libs/js/angular-ui/event' + min + '.js',
//		'../libs/js/angular-ui/angular.keypress' + min + '.js',
//		'../libs/js/showdown' + min + '.js',
//		'../libs/js/angular-bootstrap/ui-bootstrap-custom-tpls-0.3.0.min.js'
	];
}

var paths = {
	scripts: [
		'../common/*.js',
		'../src/*.js',
		'../*.js'
	],
	jsx: [
		'../components/*.js'
	],
	jsLibs: getLibs(),
	cssLibs: [
		"../libs/960/fluid_grid.css"
	],
	less: [
		'../css/*.less'
	]
};


gulp.task("scripts", function () {
	var src = gulp.src(paths.scripts);
	if (isMin) {
		src = src.pipe(uglify());
	}
	src
		.pipe(concat("app.js"))
		.pipe(gulp.dest("../build"));
});

gulp.task("jsx", function () {
	var src = gulp.src(paths.jsx);
	if (isMin) {
		src = src.pipe(uglify());
	}
	src
		.pipe(concat("components.js"))
		.pipe(gulp.dest("../build"));
});

gulp.task("js-libs", function () {
	gulp.src(paths.jsLibs)
		.pipe(concat("app.libs.js"))
		.pipe(gulp.dest("../build"))
	;
});

gulp.task("css-libs", function () {
	gulp.src(paths.cssLibs)
		.pipe(concat("app.libs.css"))
		.pipe(gulp.dest("../build"))
	;
});

gulp.task("less", function () {
	var src = gulp.src(paths.less)
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}));

	if (isMin) {
		src = src.pipe(minifyCSS());
	}
	src
		.pipe(concat("app.css"))
		.pipe(gulp.dest('../build'));
});

gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.less, ['less']);
	gulp.watch(paths.jsx, ['jsx']);
	gulp.watch(paths.cssLibs, ['css-libs']);
});

gulp.task('setup-min', function () {
	isMin = true;
	paths.jsLibs = getLibs();
});


gulp.task('run', ['scripts', 'less', 'js-libs', "css-libs", "jsx"]);
gulp.task('min', ['setup-min', 'run']);
gulp.task('default', ['run', 'watch']);


