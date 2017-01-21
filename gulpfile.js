// gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var pump = require('pump');

// webpack
var webpack = require('webpack-stream');
var WebpackConfig = require('./webpack.config.js');
var exec = require('child_process').exec;
var run = require('gulp-run-command').default

gulp.task('build', ['build-frontend'], run('embark build'));
gulp.task('build-frontend', ['webpack:build', 'copy']);
gulp.task('copy', ['copy-images', 'copy-bitkariero']);

gulp.task('webpack:build', function(cb) {
  pump([
    gulp.src('app'),
    webpack(WebpackConfig),
    uglify(),
    gulp.dest('dist/')
  ], cb);
});

gulp.task('copy-images', function(cb){
  pump([
    gulp.src('app/public/img/*'),
    gulp.dest('dist/img/')
  ], cb);
});

gulp.task('copy-bitkariero', function(cb){
  pump([
    gulp.src('app/bitkariero.js'),
    gulp.dest('dist/')
  ], cb);

});

gulp.task('watch', function() {
  gulp.watch('app/**/*' , ['build-frontend']);
});
