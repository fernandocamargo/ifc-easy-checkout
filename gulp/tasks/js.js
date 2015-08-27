var _ = require('lodash'),
	config = require('../config'),
	error = require('../utils/error'),
	notify = require("gulp-notify"),
	gulp = {
		itself: require('gulp'),
		js: {
			hint: require('gulp-jshint')
		},
		util: require('gulp-util'),
		replace: require('gulp-replace-task')
	},
	hint = {
		reporter: require('jshint-stylish')
	},
	through = require('through2'),
	requirejs = require('requirejs');

gulp.itself.task(
	'js:hint',
	function () {
		return gulp.itself.src(
			config.js.hint.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.js.hint(
				config.js.hint.settings
			)
		).pipe(
			gulp.js.hint.reporter(
				hint.reporter
			)
		).pipe(
			gulp.js.hint.reporter(
				'fail'
			)
		);
	}
);

gulp.itself.task(
	'js:requirejs',
	[
		'js:hint'
	],
	function () {
		return gulp.itself.src(
			config.requirejs.paths.src
		).pipe(
			through.obj(
				function (file, enc, callback) {
					if (file.isNull() || file.isStream()) {
						this.push(file);
						this.end();
						return callback();
					}

					if (file.isBuffer()) {
						return requirejs.optimize(
							_.merge(
								config.requirejs.settings,
								{
									out: function (content) {
										this.end();
										return callback(
											null,
											(new gulp.util.File(
												{
													path: file.relative,
													contents: (new Buffer(content))
												}
											))
										);
									}.bind(
										this
									)
								}
							)
						);
					}
				}
			)
		).pipe(
			gulp.replace({
				variables : config.replaces
			})
		).pipe(
			gulp.itself.dest(
				config.requirejs.paths.dest
			)
		).pipe(
			notify("task js:requirejs ended!")
		);
	}
);

gulp.itself.task(
	'js',
	[
		'js:requirejs'
	]
);