var gulp = require('gulp'),
    webpack = require('webpack'),
    clean = require('gulp-clean'),
    copy = require('gulp-copy'),
    uglify = require('gulp-uglify'),
    sequence = require('gulp-sequence');

/*
 * 任务：清除生编译生成的文件
 * */
gulp.task('clean', function () {
    var stream = gulp.src(['dist'])
        .pipe(clean({
            force: true
        }));
    return stream;
});

/*
 * 任务：执行webpack打包
 * */
gulp.task('webpack', function (cb) {
    var config = require('./webpack.config');

    webpack(config, function (err, stats) {
        console.log(stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));
        cb();
    });
});

/*
 * 任务：JS压缩
 * */
gulp.task('uglify', function (cb) {
    var stream = gulp.src('dist/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js-build/'));

    return stream;
});


/*
 * 任务：删除压缩前的JS
 * */
gulp.task('clean-dist-js', function () {
    var stream = gulp.src(['dist/js'])
        .pipe(clean({
            force: true
        }));
    return stream;
});


gulp.task('copy-dist-js-build', function (cb) {
    var stream = gulp.src(['dist/js-build/**/*.js'], {
            base: 'dist/js-build'
        })
        .pipe(copy('dist/js', {
            prefix : 2
        }));
    return stream;
});

/*
 * 任务：删除压缩后的临时JS文件
 * */
gulp.task('clean-dist-js-build', function () {
    var stream = gulp.src(['dist/js-build'])
        .pipe(clean({
            force: true
        }));
    return stream;
});


gulp.task('build', sequence('clean', 'webpack', 'uglify', 'clean-dist-js', 'copy-dist-js-build', 'clean-dist-js-build'));

/*
 * 任务：执行webpack打包
 * */
gulp.task('watch', ['clean'], function (cb) {
    var flag = true,
        config = require('./webpack.config');

    webpack(config).watch({
        aggregateTimeout: 300,
        poll: true
    }, function(err, stats) {
        console.log(stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true
        }));

        if (flag) {
            cb();
            flag = false;
        }
    });
});
