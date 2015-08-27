var config = require('../config'),
	util = require('util'),
	gulp = {
		itself: require('gulp')
	},
	sequence = require('run-sequence'),
	sync = require('browser-sync');

gulp.itself.task(
	'watch:sass',
	[
		'sass'
	],
	function () {
		return gulp.itself.watch(
			config.sass.paths.src,
			function () {
				return sequence(
					[
						'sass'
					],
					[
						'sprites'
					],
					[
						'inject'
					],
					sync.reload
				);
			}
		);
	}
);

gulp.itself.task(
	'watch:js',
	[
		'js'
	],
	function () {
		return gulp.itself.watch(
			config.js.paths.src,
			function () {
				return sequence(
					[
						'js'
					],
					sync.reload
				);
			}
		);
	}
);

gulp.itself.task(
	'watch:html',
	[
		'html'
	],
	function () {
		return gulp.itself.watch(
			config.html.paths.src,
			function () {
				return sequence(
					[
						'html'
					],
					[
						'inject',
					],
					sync.reload
				);
			}
		);
	}
);

gulp.itself.task(
	'watch:images',
	[
		'images'
	],
	function () {
		return gulp.itself.watch(
			config.images.paths.src,
			function () {
				return sequence(
					[
						'images'
					],
					sync.reload
				);
			}
		);
	}
);


gulp.itself.task(
	'watch:docs',
	[
		'docs'
	],
	function () {
		return gulp.itself.watch(
			config.docs.paths.src,
			function () {
				return sequence(
					[
						'docs'
					],
					sync.reload
				);
			}
		);
	}
);

gulp.itself.task(
	'watch:browser-sync',
	[
		'watch:sass',
		'watch:js',
		'watch:html',
		'watch:images',
		'watch:docs'
	],
	function () {
		return gulp.itself.watch(
			config['browser-sync'].paths.src
		).on(
			'change',
			sync.reload
		);
	}
);

gulp.itself.task(
	'watch',
	[
		'watch:browser-sync'
	]
);