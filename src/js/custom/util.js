/* global define, _, $ */
define(
	function () {
		'use strict';
		var _namespace = 'util';
		var _root = function () {};
		var _public = _root.prototype;
		var _defaults = {};

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
			return this;
		};

		_public.now = function () {
			arguments.temp = {};
			arguments.temp.time = {
				current: new Date().getTime(),
				last: null
			};
			while (_.isEqual(arguments.temp.time.current, (new Date()).getTime())) {
				arguments.temp.time.last = arguments.temp.time.current;
			}
			delete arguments.temp;
			return new Date().getTime();
		};

		_public.footprint = function () {
			return {
				bind: function (segments, extra) {
					segments = (_.isUndefined(segments) ? false : (_.isArray(segments) ? segments : segments.toString().split(' ')));
					extra = (_.reduce(
						(_.isUndefined(extra) ? [this.namespace] : [this.namespace, extra.toString()]),
						function (items, item) {
							items.push('.' + item);
							return items;
						},
						[]
					)).concat([' ']).join('');
					return (segments ? $.trim(segments.concat([' ']).join(extra)) : '');
				}.bind(this)
			};
		};

		_public.object = function (object) {
			return {
				path: function (path) {
					return _.reduce(
						path.toString().split('.'),
						function (fragments, fragment) {
							return (fragments.hasOwnProperty(fragment) ? fragments[fragment] : false);
						},
						object
					);
				}
			};
		};

		_public.bind = function (params) {
			params = (params || {});
			params.id = (!_.isUndefined(params.id) ? (_.isArray(params.id) ? params.id : [params.id]) : false);
			params.DOM = (params.DOM || false);
			_.each(
				_.reduce(
					_.merge(
						[],
						this.settings.events
					),
					function (events, event) {
						if ((!params.id && event.hasOwnProperty('default') && event['default']) || _.contains(params.id, event.id)) {
							events.push(event);
						}
						return events;
					},
					[]
				),
				function (event, index) {
					event = (event || {});
					event.DOM = (params.DOM || (function (DOM) {
						switch (true) {
						case _.isFunction(DOM):
							DOM = DOM.call(this, event, params);
							break;
						case _.isString(DOM):
							DOM = _public.object(this.settings.DOM).path(DOM);
							break;
						}
						return DOM;
					}.call(this, event.DOM)));					
					event.DOM = (event.DOM.jquery ? event.DOM : $);
					event.type = event.type.toString();
					event.id = (event.id || ['event', index].join('.'));
					event.context = (_.isString(event.handler) ? this : {
						root: this,
						self: event,
						params: params
					});
					event.handler = (_.isString(event.handler) ? _public.object(this).path(event.handler) : event.handler);
					event.handler = (_.isFunction(event.handler) ? event.handler : $.noop);
					event['default'] = (!_.isUndefined(event['default']) ? event['default'] : false);
					event.DOM.unbind(
						_public.footprint.call(this).bind(event.type, event.id)
					).bind(
						_public.footprint.call(this).bind(event.type, event.id),
						(params.params || {}),
						event.handler.bind(event.context)
					);
					return this;
				}.bind(this)
			);
			return this;
		};

		_public.validate = function (object) {
			return {
				email: function () {
					return ((object || '').toString().match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) ? true : false);
				}
			};
		};

		return _public;
	}
);