// gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var connect = require('gulp-connect');

// webpack
var webpack = require('webpack-stream');
var WebpackConfig = require('./webpack.config.js');
var exec = require('child_process').exec;
var run = require('gulp-run-command').default

gulp.task('build', ['build-frontend'], run('embark build'));
gulp.task('build-frontend', ['webpack:build', 'copy']);
gulp.task('copy', ['copy-images', 'copy-bitkariero', 'copy-contracts']);

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

gulp.task('copy-contracts', function(cb){
  pump([
    gulp.src('app/contracts/*'),
    gulp.dest('dist/contracts/')
  ], cb);
});

gulp.task('copy-bitkariero', function(cb){
  pump([
    gulp.src('app/bitkariero.js'),
    gulp.dest('dist/')
  ], cb);

});

gulp.task('connect', function() {
  connect.server({
    root: './dist',
    port: 8000,
    host: '0.0.0.0'
  });  
});

gulp.task('watch', function() {
  gulp.watch('app/**/*' , ['build']);
});

gulp.task('default', ['connect', 'watch']);
