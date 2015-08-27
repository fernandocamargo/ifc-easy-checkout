var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		cache: require('gulp-cache'),
		itself: require('gulp'),
		minify: {
			css: require('gulp-minify-css'),
			html: require('gulp-minify-html'),
			js: require('gulp-uglify'),
			images: require('gulp-imagemin')
		},
		sourcemaps: require('gulp-sourcemaps'),
		webp: require('gulp-webp')
	};

gulp.itself.task(
	'minify:css',
	[
		'sass'
	],
	function () {
		return gulp.itself.src(
			config.minify.css.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.sourcemaps.init()
		).pipe(
			gulp.minify.css(
				config.minify.css.settings
			)
		).pipe(
			gulp.sourcemaps.write(
				config.sourcemaps.paths.relative
			)
		).pipe(
			gulp.itself.dest(
				config.sass.paths.dest
			)
		);
	}
);

gulp.itself.task(
	'minify:js',
	[
		'js'
	],
	function () {
		return gulp.itself.src(
			config.minify.js.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.sourcemaps.init()
		).pipe(
			gulp.minify.js(
				config.minify.js.settings
			)
		).pipe(
			gulp.sourcemaps.write(
				config.sourcemaps.paths.relative
			)
		).pipe(
			gulp.itself.dest(
				config.js.paths.dest
			)
		);
	}
);

gulp.itself.task(
	'minify:html',
	[
		'html'
	],
	function () {
		return gulp.itself.src(
			config.minify.html.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.minify.html(
				config.minify.html.settings
			)
		).pipe(
			gulp.itself.dest(
				config.html.paths.dest
			)
		);
	}
);

gulp.itself.task(
	'minify:images:min',
	[
		'images'
	],
	function () {
		return gulp.itself.src(
			config.minify.images.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.cache(
				gulp.minify.images(
					config.minify.images.settings
				)
			)
		).pipe(
			gulp.itself.dest(
				config.images.paths.dest
			)
		);
	}
);

gulp.itself.task(
	'minify:images:webp',
	[
		'minify:images:min'
	],
	function () {
		return gulp.itself.src(
			config.minify.images.paths.src
		).on(
			'error',
			error
		).pipe(
			gulp.webp(
				config.images.webp.settings
			)
		).pipe(
			gulp.itself.dest(
				config.images.paths.dest
			)
		);
	}
);

gulp.itself.task(
	'minify:images',
	[
		'minify:images:webp'
	]
);

gulp.itself.task(
	'minify:docs',
	[
		'docs'
	]
);

gulp.itself.task(
	'minify',
	[
		'minify:css',
		'minify:js',
		'minify:html',
		'minify:images',
		'minify:docs'
	]
);
