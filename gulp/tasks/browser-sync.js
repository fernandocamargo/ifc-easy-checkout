var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		itself: require('gulp')
	},
	sync = require('browser-sync');

gulp.itself.task(
	'browser-sync',
	function () {
		return sync(
			config['browser-sync'].settings
		);
	}
);