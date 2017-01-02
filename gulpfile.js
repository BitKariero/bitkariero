// gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var pump = require('pump');

// webpack
var webpack = require('webpack-stream');
var WebpackConfig = require('./webpack.config.js');

gulp.task('build', ['webpack:build']);
gulp.task('watch', ['webpack:watch', 'webserver']);

gulp.task('webserver', function(cb) {
  pump([
    gulp.src('app/public/'),
    webserver({
      host: '0.0.0.0',
      directoryListing: {
        enable:true,
        path: 'app/public/'
      },
      livereload: true,
      open: true
    })
  ], cb);
});

gulp.task('webpack:build', function(cb) {
  pump([
    gulp.src('app'),
    webpack(WebpackConfig),
    uglify(),
    gulp.dest('app/public/')
  ], cb);
});

gulp.task('webpack:watch', function(cb){
  // Modify the config to include the watch option
  var wpWatchConfig = Object.create(WebpackConfig);
  wpWatchConfig.watch = true;

  pump([
    gulp.src('app'),
    webpack(wpWatchConfig),
    gulp.dest('app/public/')
  ], cb);
});
