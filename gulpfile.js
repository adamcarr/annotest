'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsProject = ts.createProject({
    typescript: require('typescript'),
    noImplicitAny: true,
	module: 'commonjs',
	target: 'ES5',
    outDir: 'dist',
    emitDecoratorMetadata: true
});

gulp.task('scripts', function() {
    gulp.src('src/**/*.ts').pipe(ts(tsProject))
        .pipe(gulp.dest('dist'));
});
gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('default', ['scripts']);