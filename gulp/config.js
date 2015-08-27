var  _ = require('lodash'),
	argv = require('minimist')(process.argv.slice(2)),
	project = require('../package.json'),
	projectPathName = project.name+'-'+project.version,
	chalk = require('chalk'),
	decoration_separator = chalk.cyan,
	decoration_separator_str = '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-',
	decoration_key = chalk.white.bold,
	decoration_value = chalk.bgBlack.green;

console.log(
	decoration_separator(decoration_separator_str),
	'\n',
	' \
	 ._________________.  \n\
	 | _______________ |  \n\
	 | I             I |  \n\
	 | I  starting!  I |  \n\
	 | I   wait...   I |  \n\
	 | I             I |  \n\
	 | I_____________I |  \n\
	 !_________________!  \n\
	    ._[_______]_.     \n\
	.___|___________|___. \n\
	|::: ____           | \n\
	|    ~~~~ [------]  | \n\
	!___________________! \n\
	                      \n\
',
	decoration_separator(decoration_separator_str),
	'\n',
	decoration_key('Project: '), decoration_value(project.name), 
	'\n',
	decoration_key('Version: '), decoration_value(project.version), 
	'\n',
	decoration_key('Static Path: '), decoration_value(projectPathName), 
	'\n',
	decoration_separator(decoration_separator_str),
	'\n',
	'Aguarde... iniciando compilação...',
	'\n'
);
var deploy = (argv.hasOwnProperty('deploy') ? !!argv.deploy : false),
	util = require('util'),
	root = '.',
	replaces = {
		'staticUrl' 		: project.publish.remote_http.static,
		'year'		 		: new Date().getFullYear(),
		'projectPathName' 	: projectPathName,
		'ifcEventsPathName' : 'ifc-events-0.0.1',
	},
	paths = {
		assets: 'htdocs',
		custom: 'custom',
		vendor: 'vendor',
		node: {
			modules: 'node_modules'
		},
		dest: util.format(
			'%s/build',
			root
		),
		src: util.format(
			'%s/src',
			root
		),
		css_inject_html : [
			'system-first-load.css'
		],
		sass: {
			dest: 'css'+'/'+projectPathName,
			src: 'sass',
			extension: {
				dest: 'css',
				src: [
					'sass',
					'scss'
				]
			}
		},
		js: {
			dest: 'js'+'/'+projectPathName,
			src: 'js',
			output: project.name,
			extension: {
				dest: 'js',
				src: 'js'
			}
		},
		jsx: {
			extension: {
				dest: 'js',
				src: 'jsx'
			}
		},
		html: {
			dest: 'html'+'/'+projectPathName,
			src: 'html',
			extension: {
				dest: [
					'html',
					'htm'
				],
				src: [
					'html',
					'htm'
				]
			}
		},
		docs: {
			extension: {
				dest: {
					fonts: [
						'eot',
						'otf',
						'svg',
						'ttf',
						'woff'
					],
					json : [
						'json',
						'jsonp'
					],
					plain: [
						'csv',
						'txt',
						'xml'
					],
					rich: [
						'doc',
						'docx',
						'pdf',
						'ppt',
						'xls',
						'xlsx'
					]
				},
				src: {
					fonts: [
						'eot',
						'otf',
						'svg',
						'ttf',
						'woff'
					],
					json : [
						'json',
						'jsonp'
					],
					plain: [
						'csv',
						'txt',
						'xml'
					],
					rich: [
						'doc',
						'docx',
						'pdf',
						'ppt',
						'xls',
						'xlsx'
					]
				}
			}
		},
		images: {
			dest: 'images'+'/'+projectPathName,
			src: 'images',
			extension: {
				dest: [
					'gif',
					'jpg',
					'jpeg',
					'png',
					'webp'
				],
				src: [
					'gif',
					'jpg',
					'jpeg',
					'png',
					'webp'
				]
			}
		},
		maps: {
			extension: {
				dest: 'map'
			}
		}
	};

module.exports = {
	'browser-sync': {
		settings: {
			browser: [],
			server: {
				baseDir: paths.dest
			},
			settings: {
				stream: true
			}
		},
		paths:  (function(types){
			var types = {};
			_.each(paths.docs.extension.src, function(list, key){
				types[key] = {
					src : util.format(
								'%s/%s/**/*.{%s}',
								paths.src,
								key,
								[].concat(
									list
								).toString()
							),
					dest : util.format(
								'%s/%s/%s/%s',
								paths.dest,
								paths.assets,
								key,
								projectPathName
							),
				}
			});

			return types;
		})(paths.docs.extension.src)
	},
	replaces: replaces,
	deploy: deploy,
	docs: {
		paths: (function(types){
			var types = {};
			_.each(paths.docs.extension.src, function(list, key){
				types[key] = {
					src : util.format(
								'%s/%s/**/*.{%s}',
								paths.src,
								key,
								[].concat(
									list
								).toString()
							),
					dest : util.format(
								'%s/%s/%s/%s',
								paths.dest,
								paths.assets,
								key,
								projectPathName
							),
				}
			});

			return types;
		})(paths.docs.extension.src)
	},
	error: {
		title: 'Compile Error',
		message: '<%= error %>'
	},
	gzip: {
		settings: {},
		paths: {
			dest: paths.dest,
			src: util.format(
				'%s/**/*.{%s}',
				paths.dest,
				[].concat(
					paths.sass.extension.dest,
					paths.js.extension.dest,
					paths.html.extension.dest,
					_.flatten(
						_.values(
							paths.docs.extension.dest
						)
					),
					paths.maps.extension.dest
				).toString(
				)
			)
		}
	},
	html: {
		paths: {
			dest: paths.dest,
			src: util.format(
				'%s/%s/**/*.*',
				paths.src,
				paths.html.src
			)
		}
	},
	images: {
		paths: {
			dest: util.format(
				'%s/%s/%s',
				paths.dest,
				paths.assets,
				paths.images.dest
			),
			src: util.format(
				'%s/%s/**/*.*',
				paths.src,
				paths.images.src
			),
			dist : util.format(
				'../../%s',
				paths.images.dest
			)
		},
		webp: {
			settings: {}
		}
	},
	js: {
		hint: {
			settings: {
				multistr : true
			},
			paths: {
				src: util.format(
					'%s/%s/%s/**/*.%s',
					paths.src,
					paths.js.src,
					paths.custom,
					paths.js.extension.src
				)
			}
		},
		paths: {
			dest: util.format(
				'%s/%s/%s',
				paths.dest,
				paths.assets,
				paths.js.dest
			),
			src: util.format(
				'%s/%s/**/*.{%s}',
				paths.src,
				paths.js.src,
				[].concat(
					paths.js.extension.src,
					paths.jsx.extension.src
				).toString(
				)
			)
		}
	},
	minify: {
		css: {
			settings: {},
			paths: {
				src: util.format(
					'%s/%s/%s/**/*.%s',
					paths.dest,
					paths.assets,
					paths.sass.dest,
					paths.sass.extension.dest
				)
			}
		},
		js: {
			settings: {},
			paths: {
				src: util.format(
					'%s/%s/%s/**/*.%s',
					paths.dest,
					paths.assets,
					paths.js.dest,
					paths.js.extension.dest
				)
			}
		},
		html: {
			settings: {},
			paths: {
				src: util.format(
					'%s/**/*.{%s}',
					paths.dest,
					paths.html.extension.dest.toString()
				)
			}
		},
		images: {
			settings: {
				interlaced: true,
				optimizationLevel: 3,
				progressive: true
			},
			paths: {
				src: util.format(
					'%s/%s/%s/**/*.*',
					paths.dest,
					paths.assets,
					paths.images.dest
				)
			}
		}
	},
	paths: paths,
	requirejs: {
		settings: {
			baseUrl: util.format(
				'./%s/%s',
				paths.src,
				paths.js.src
			),
			jsx: {
				fileExtension: util.format(
					'.%s',
					paths.jsx.extension.src
				),
				harmony: true,
				stripTypes: true
			},
			name: paths.js.output,
			out: util.format(
				'%s.%s',
				paths.js.output,
				paths.js.extension.dest
			),
			optimize: 'none',
			paths: {
				// requirejs: util.format('%s/require/require', paths.vendor),
				text: util.format('%s/require/plugin/text', paths.vendor),
				domReady: util.format('%s/require/plugin/domReady', paths.vendor),
				async: util.format('%s/require/plugin/async', paths.vendor),
				jsx: util.format('%s/require/plugin/jsx', paths.vendor),
				react: util.format('../../%s/react/dist/react-with-addons%s', paths.node.modules, (deploy ? '.min' : '')),
				classnames: util.format('%s/classnames/classnames', paths.vendor),
				invariant: util.format('%s/invariant/invariant', paths.vendor),
				keymirror: util.format('%s/keymirror/keymirror', paths.vendor),
				events: util.format('%s/events/events', paths.vendor),
				flux: util.format('%s/flux/flux', paths.vendor),
				JSXTransformer: util.format('%s/JSXTransformer/JSXTransformer', paths.vendor),
				'ifc-app-easy-checkout': util.format('%s/app', paths.custom)
			},
			shim: {
				text: {
					deps: [
						// 'requirejs'
					]
				},
				domReady: {
					deps: [
						// 'requirejs'
					]
				},
				async: {
					deps: [
						// 'requirejs'
					]
				},
				jsx: {
					deps: [
						// 'requirejs'
					]
				},
				react: {
					exports: 'react',
					deps : [
						// 'polyfill'
					]
				},
				invariant: {
					exports: 'invariant'
				},
				keymirror: {
					exports: 'keymirror'
				},
				events: {
					exports: 'events'
				},
				flux: {
					deps: [
						'react',
						'invariant',
						'keymirror',
						'events'
					],
					exports: 'flux'
				},
				'ifc-app-easy-checkout': {
					deps: [
						'text',
						'jsx',
						'react',
						'classnames',
						'flux'
					],
					exports: 'ifc-app-easy-checkout'
				}
			},
			stubModules: [
				'jsx',
				'JSXTransformer'
			],
			urlArgs: _.now()
		},
		paths: {
			dest: util.format(
				'%s/%s/%s',
				paths.dest,
				paths.assets,
				paths.js.dest
			),
			src: util.format(
				'%s/%s/%s.%s',
				paths.src,
				paths.js.src,
				paths.js.output,
				paths.js.extension.src
			),
			output: util.format(
				'%s.%s',
				paths.js.output,
				paths.js.extension.dest
			)
		}
	},
	sass: {
		settings: {
			indentedSyntax: !deploy,
			errLogToConsole: true,
			sourceComments: !deploy,
			outputStyle: (deploy ? 'compressed' : 'expanded'),
			sourceMapContents : !deploy,
			sourceMapEmbed : !deploy
		},
		autoprefixer: {
			settings: {
				browsers: [
					// https://github.com/ai/browserslist#queries
					'last 2 version',
					'> 1%',
					'Firefox >= 20',
					'ie 8',
					'ie 7',
					'iOS 7'
				]
			}
		},
		paths: {
			dest: util.format(
				'%s/%s/%s',
				paths.dest,
				paths.assets,
				paths.sass.dest
			),
			src: util.format(
				'%s/%s/**/*.{%s}',
				paths.src,
				paths.sass.src,
				paths.sass.extension.src.toString()
			)
		}
	},
	sourcemaps: {
		paths: {
			relative: root
		}
	}
};