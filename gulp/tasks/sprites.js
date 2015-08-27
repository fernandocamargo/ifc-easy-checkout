var config = require('../config'),
	error = require('../utils/error'),
	gulp = {
		changed: require('gulp-changed'),
		itself: require('gulp'),
		sprite: require('gulp-sprite-generator')
	};

gulp.itself.task(
	'sprites',
	function () {
		var spriteOutput;
		spriteOutput = gulp.itself.src(config.sass.paths.dest + '/*.'+config.paths.sass.extension.dest)
			.on(
				'error',
				error
			).pipe(
				gulp.sprite({
					algorithm:        "binary-tree",
					baseUrl:         config.images.paths.src,
					spriteSheetName: "sprite.png",
					spriteSheetPath: config.images.paths.dist,
					filter: [
						// this is a copy of built in filter of meta skip 
						// do not forget to set it up in your stylesheets using doc block /* */ 
						function(image) {
							return !image.meta.skip;
						}
					],
				 	groupBy: [
						function(image) {
							var subPath = image.path.replace('\\','/').split('/');
							if(subPath.length){
								subPath = subPath.slice(
											subPath.length - 2 /* remove 2 last part because the last position it is the image */, 
											subPath.length - 1
										).join('');
								if(subPath !== config.paths.images.dest){
									return subPath;
								}
								return config.paths.images.dest;
							}
						}
					]
				})
			);

		spriteOutput.css.pipe(gulp.itself.dest(config.sass.paths.dest));
		spriteOutput.img.pipe(gulp.itself.dest(config.images.paths.dest));

		return spriteOutput;
	}
);