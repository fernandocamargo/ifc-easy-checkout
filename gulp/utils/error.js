var config = require('../config'),
	notify = require('gulp-notify');

module.exports = function () {
	notify.onError(
		config.error
	).apply(
		this,
		Array.prototype.slice.call(
			arguments
		)
	);
	return this.emit('end');
};