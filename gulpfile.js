'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat-util');

var tsProject = ts.createProject({
    typescript: require('typescript'),
    noImplicitAny: true,
	module: 'commonjs',
	target: 'ES5',
    outDir: 'dist',
    emitDecoratorMetadata: true
});

gulp.task('scripts', function() {
    return gulp.src('src/**/*.ts').pipe(ts(tsProject))
        .pipe(gulp.dest('dist'));
});

gulp.task('create-cli', ['scripts'], function () {
    return gulp.src('dist/Runner.js')
        .pipe(concat.header('#!/usr/bin/env node \n\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts', 'create-cli']);