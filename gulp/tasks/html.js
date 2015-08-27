var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		changed: require('gulp-changed'),
		itself: require('gulp'),
		replace: require('gulp-replace-task')
	};

gulp.itself.task(
	'html',
	function () {
		return gulp.itself.src(
			config.html.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.changed(
				config.html.paths.dest
			)
		).pipe(
			gulp.replace({
				variables : config.replaces
			})
		).pipe(
			gulp.itself.dest(
				config.html.paths.dest
			)
		);
	}
);