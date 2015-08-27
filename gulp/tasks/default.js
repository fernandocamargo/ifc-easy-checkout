var _ = require('lodash'),
	config = require('../config'),
	gulp = require('gulp'),
	sequence = require('run-sequence'),
	tasks = {
		defaults: [
			'clear'
		],
		dev: [
			'browser-sync',
			'watch'
		],
		deploy: [
			'gzip'
		]
	};

if(process.argv.indexOf('--sftp') > -1){
	_.each(tasks, function(list, key){
		tasks[key].push('sftp')
	});
}

gulp.task(
	'default',
	function (callback) {
		return sequence.apply(
			sequence,
			tasks.defaults.concat(
				tasks[  ( config.deploy ? 'deploy' : 'dev') ],
				callback
			)
		);
	}
);