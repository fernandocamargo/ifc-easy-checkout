var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		itself: require('gulp'),
		gzip: require('gulp-gzip')
	};

gulp.itself.task(
	'gzip',
	[
		'minify'
	],
	function () {
		return gulp.itself.src(
			config.gzip.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.gzip(
				config.gzip.settings
			)
		).pipe(
			gulp.itself.dest(
				config.gzip.paths.dest
			)
		);
	}
);