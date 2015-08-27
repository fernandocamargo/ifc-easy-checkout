var project = require('../../package.json'),
	config = require('../config'),
	util = require('util'),
	error = require('../utils/error'),
	chalk = require('chalk'),
	sync = require('browser-sync'),
	sequence = require('run-sequence'),
	gulp = {
		changed: require('gulp-changed'),
		itself: require('gulp'),
		sftp: require('gulp-sftp')
	},
	assets_to_publish = util.format(
		'%s/%s/**/*',
		config.paths.dest,
		config.paths.assets
	);

gulp.itself.task(
	'sftp:htdocs-to-dev',
	function () {
		console.log(chalk.bgBlack.green('\ncd '+assets_to_publish+' \n' +
						'Iniciando sftp://'+ 
						project.publish.remote_path_static.user + '@' + 
						project.publish.remote_path_static.host + '\n'));

		return gulp.itself.src(
			assets_to_publish
		).pipe(
			gulp.changed(
				assets_to_publish
			)
		).pipe(
			gulp.sftp(project.publish.remote_path_static)
		);
	}
);

gulp.itself.task(
	'sftp',
	[
		'sftp:htdocs-to-dev'
	],
	function () {
		return gulp.itself.watch(
			assets_to_publish,
			function () {
				return sequence(
					[
						'sftp:htdocs-to-dev'
					],
					sync.reload
				);
			}
		);
	}
);