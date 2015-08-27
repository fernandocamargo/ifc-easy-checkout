var config = require('../config'),
	del = require('del'),
	error = require('../utils/error'),
	gulp = {
		cache: require('gulp-cache'),
		itself: require('gulp')
	},
	source = require('vinyl-paths');

gulp.itself.task(
	'clear:dir',
	function () {
		return gulp.itself.src(
			config.paths.dest
		).on(
			'error',
			error
		).pipe(
			source(
				del
			)
		);
	}
);

gulp.itself.task(
	'clear:cache',
	function (callback) {
		return gulp.cache.clearAll(callback);
	}
);

gulp.itself.task(
	'clear',
	[
		'clear:dir',
		'clear:cache'
	]
);