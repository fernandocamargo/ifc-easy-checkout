/* global define, _, $ */
define(
	function () {
		'use strict';
		var _namespace = 'preloader';
		var _root = function () {};
		var _public = _root.prototype;
		var _defaults = {
			DOM: {
				html: $('html'),
				body: $('body'),
				images: $('img'),
				requester: $(document.createElement('img'))
			},
			timeouts: {},
			events: [
				{
					id: 'requester.load',
					type: 'load error abort',
					handler: 'retrieve'
				}
			],
			parsers: {
				css: function () {
					return _.reduce(
						_.reduce(
							document.styleSheets,
							function (sheets, sheet) {
								_private.stylesheets.push(sheet);
								sheets = (!!sheet.href && !!(sheet.href || '').indexOf(window.location.href) ? sheets : sheets.concat(
									_.reduce(
										(sheet.cssRules ? sheet.cssRules : [sheet]),
										function (rules, rule) {
											rules = rules.concat(
												_.reduce(
													(rule.cssText || '').match(/[^\("]+\.(gif|jpg|jpeg|png)/g),
													function (matches, match) {
														matches.push(/^((f|ht)tps?:)?\/\//i.test(match) ? match : ((!!sheet.href ? sheet.href :  '').substr(0, ((!!sheet.href ? sheet.href :  '').lastIndexOf('/') + 1)) + match));
														return matches;
													},
													[]
												)
											);
											return rules;
										},
										[]
									)
								));
								return sheets;
							},
							[]
						),
						function (images, image) {
							images.push(image);
							return images;
						},
						[]
					);
				},
				html: function () {
					return _.reduce(
						this.settings.DOM.images,
						function (images, image) {
							var src = image.getAttribute('src') || null,
								notPreload = image.getAttribute('data-preload') || null;
							if(!!src && !!notPreload){
								images.push(src);
							}
							return images;
						},
						[]
					);
				},
				package: function (resource) {
					arguments.temp = {};
					arguments.temp.resource = _.merge(
						{
							path: false,
							range: [0, 0],
							extension: false
						},
						resource
					);
					arguments.temp.resource.condition = (arguments.temp.resource.path && arguments.temp.resource.extension && (arguments.temp.resource.range[1] > arguments.temp.resource.range[0]));
					return _.reduce(
						(arguments.temp.resource.condition ? (new Array((arguments.temp.resource.range[1] - arguments.temp.resource.range[0]) + 1).join(true).split(true)) : false),
						function (images, image, index) {
							images.push(
								[
									this.path,
									(!_.isEqual(this.path.substr(-1), '/') ? '/' : ''),
									(this.range[0] + index),
									'.',
									this.extension
								].join('')
							);
							return images;
						}.bind(arguments.temp.resource),
						[]
					);
				}
			}
		};
		var _private = {
			stylesheets: [],
			items: [],
			current: -1,
			loaded: 0
		};

		_public.init = function (parent, settings) {
			this.namespace = _namespace;
			this.parent = (parent || this);
			this.settings = _.merge(
				{},
				_defaults,
				settings
			);
			this.build.call(this);
			return this;
		};

		_public.build = function () {
			this.parent.util.bind.call(this);
			this.parse.call(this);
			this.emit.call(this, 'start');
			return this;
		};

		_public.parse = function () {
			_.each(
				this.settings.resources,
				function (resource) {
					switch (true) {
					case (_.isFunction(this.settings.parsers.hasOwnProperty(resource.type) ? this.settings.parsers[resource.type] : resource.type)):
						resource.items = (this.settings.parsers.hasOwnProperty(resource.type) ? this.settings.parsers[resource.type] : resource.type).call(this, resource);
						break;
					}
					this.enqueue(resource);
				}.bind(this)
			);
			this.move.call(this);
			return this;
		};

		_public.move = function () {
			this.update.call(this);
			this[(!this.status.call(this).completed ? 'request' : 'ready')].call(this);
			return this;
		};

		_public.enqueue = function (resource) {
			_private.items = _private.items.concat.call(
				_private.items,
				_.reduce(
					_.uniq(resource.items),
					function (items, path) {
						items.push(
							{
								loaded: false,
								path: (path + (this.settings.anticache ? (((path.indexOf('?') < 0) ? '?' : '&') + 'anticache=' + this.parent.util.now.call(this)) : '')),
								resource: resource
							}
						);
						return items;
					}.bind(this),
					[]
				)
			);
			return this;
		};

		_public.request = function () {
			_private.current += 1;
			switch (true) {
			case (!_.isNull(_private.items[_private.current].path.match(/[^\("]+\.(gif|jpg|jpeg|png)/g))):
				this.parent.util.bind.call(
					this,
					{
						id: 'requester.load',
						DOM: this.settings.DOM.requester.attr(
							'src',
							_private.items[_private.current].path
						)
					}
				);
				break;
			case (!_.isNull(_private.items[_private.current].path.match(/[^\("]+\.(txt|json|htm|html|css|js)/g))):
				$.ajax(
					{
						url: _private.items[_private.current].path,
						data: {},
						dataType: 'json',
						success: this.retrieve.bind(this),
						error: this.retrieve.bind(this)
					}
				);
				break;
			default:
				this.move.call(this);
				break;
			}
			return this;
		};

		_public.retrieve = function () {
			arguments.temp = {};
			arguments.temp.item = _private.items[_private.current];
			arguments.temp.response = (arguments[0] || false);
			arguments.temp.status = (arguments[1] || false);
			arguments.temp.request = (arguments[2] || false);
			_private.loaded += 1;
			arguments.temp.item.loaded = true;
			if (arguments.temp.request && arguments.temp.status && _.isEqual(arguments.temp.status, 'success')) {
				this.parent.content(arguments.temp.item.resource.alias, arguments.temp.response);
			}
			this.move.call(this);
			delete arguments.temp;
			return this;
		};

		_public.status = function () {
			return {
				completed: (!_private.items.length || (_private.loaded >= _private.items.length)),
				progress: (!_private.items.length ? 100 : ((_private.current < 0) ? 0 : parseInt(((100 * (_private.current + 1)) / _private.items.length), 10))),
				index: _private.current,
				current: (_private.items.hasOwnProperty(_private.current) ? _private.items[_private.current] : false)
			};
		};

		_public.emit = function (method) {
			if (this.settings.hasOwnProperty(method) && _.isFunction(this.settings[method])) {
				this.settings[method].call(this, this.status.call(this));
			}
			return this;
		};

		_public.update = function () {
			this.emit.call(this, 'update');
			return this;
		};

		_public.ready = function () {
			_.each(
				_private.stylesheets,
				function (sheet) {
					if (!_.isUndefined(sheet.media.mediaText)) {
						sheet.media.mediaText = '';
					} else {
						sheet.media = '';
					}
					return this;
				}
			);
			return this;
		};

		return _public;
	}
);