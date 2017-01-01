// gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

// webpack
var webpack = require('webpack-stream');
var WebpackConfig = require('./webpack.config.js');

gulp.task('build', ['webpack:build']);
gulp.task('watch', ['webpack:watch', 'webserver']);

gulp.task('webserver', function() {
  gulp.src('app/public/')
    .pipe(webserver({
      host: '0.0.0.0',
      directoryListing: {
        enable:true,
        path: 'app/public/'
      },
      livereload: true,
      open: true
    }));
});

gulp.task('webpack:build', function() {
  return gulp.src('app')
    .pipe(webpack(WebpackConfig))
    .pipe(uglify())
    .pipe(gulp.dest('app/public/'));
});

gulp.task('webpack:watch', function(){
  // Modify the config to include the watch option
  var wpWatchConfig = Object.create(WebpackConfig);
  wpWatchConfig.watch = true;

  return gulp.src('app')
      .pipe(webpack(wpWatchConfig))
      .pipe(gulp.dest('app/public/'));
});
