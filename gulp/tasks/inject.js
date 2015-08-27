var config = require('../config'),
	util = require('util'),
	error = require('../utils/error'),
	gulp = {
		itself: require('gulp'),
		inject: require('gulp-inject')
	};
gulp.itself.task(
	'inject:css-in-html',
	function () {
		return gulp.itself.src(
			util.format(
			'%s/**/*.html',
				config.paths.dest
			)
		).on(
			'error',
			error
		).pipe(
			gulp.inject(
				gulp.itself.src(
					//config.sass.paths.dest + '/*.'+config.paths.sass.extension.dest
					config.sass.paths.dest + '/'+config.paths.css_inject_html
					,{read: true}
				),
				{
					starttag: '<style id="css_inject_html">',
					endtag: '</style>',
					name: 'css_inject_html',
					transform: function (filePath, file) {
						// return file contents as string 
						return file.contents.toString('utf8')
					}
				}
			)
		).pipe(
			gulp.itself.dest(
				config.paths.dest
			)
		);
	}
);
gulp.itself.task(
	'inject',
	[
		//'inject:css-in-html'
	]
);