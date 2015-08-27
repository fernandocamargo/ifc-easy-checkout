var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		changed: require('gulp-changed'),
		itself: require('gulp')
	};

gulp.itself.task(
	'images',
	function () {
		return gulp.itself.src(
			config.images.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.changed(
				config.images.paths.dest
			)
		).pipe(
			gulp.itself.dest(
				config.images.paths.dest
			)
		);
	}
);