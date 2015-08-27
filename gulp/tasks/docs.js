var config = require('../config'),
	_ = require('lodash'),
	error = require('../utils/error'),
	gulp = {
		changed: require('gulp-changed'),
		itself: require('gulp')
	},
	subtasks = [];

_.each(config.paths.docs.extension.src, function(n, key){
	var subtak = 'docs:'+key;
	
	subtasks.push(subtak);

	gulp.itself.task(
		subtak,
		function () {
			return gulp.itself.src(
				config.docs.paths[key].src
			).on(
				'error',
				error
			).pipe(
				gulp.changed(
					config.docs.paths[key].dest
				)
			).pipe(
				gulp.itself.dest(
					config.docs.paths[key].dest
				)
			);
		}
	);
});

gulp.itself.task(
	'docs',
	subtasks
);