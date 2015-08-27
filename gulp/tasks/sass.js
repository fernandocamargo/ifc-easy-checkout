var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		itself: require('gulp'),
		sass: require('gulp-sass'),
		sourcemaps: require('gulp-sourcemaps'),
		autoprefixer: require('gulp-autoprefixer'),
		replace: require('gulp-replace-task')
	};

gulp.itself.task(
	'sass',
	function () {
		return gulp.itself.src(
			config.sass.paths.src
		).on(
			'error',
			error
		)
		// .pipe(
		// 	gulp.sourcemaps.init()
		// )
		.pipe(
			gulp.sass(
				config.sass.settings
			)
		).pipe(
			gulp.autoprefixer(
				config.sass.autoprefixer.settings
			)
		)
		// .pipe(
		// 	gulp.sourcemaps.write()
		// )
		.pipe(
			gulp.replace({
				variables : config.replaces
			})
		)
		.pipe(
			gulp.itself.dest(
				config.sass.paths.dest
			)
		);
	}
);