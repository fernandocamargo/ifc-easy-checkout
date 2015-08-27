/* global define, _, $, Mustache */
define(
	function () {
		'use strict';
		var _namespace = 'user-agent';
		var _root = function () {};
		var _public = _root.prototype;
		var _defaults = {
			DOM: {
				window: $(window),
				document: $(document),
				html: $('html'),
				body: $('body')
			},
			templates: {
				recognizable: '{{attribute}}{{#operating-system.acronym}} ua-{{.}}{{/operating-system.acronym}} ua-{{navigator.acronym}}{{#navigator.version}} ua-{{navigator.acronym}}-{{.}}{{/navigator.version}}',
				debuggable: '{{attribute}} (os.name: {{operating-system.name}} | navigator.name: {{navigator.name}} | navigator.version: {{navigator.version}})'
			},
			environments: [
				{
					type: 'operating-system',
					'has-version': false,
					items: [
						{name: 'iPad', acronym: 'ipad', pattern: /(ipad)/},
						{name: 'iPhone', acronym: 'iphone', pattern: /(iphone)/},
						{name: 'iPod', acronym: 'ipod', pattern: /(ipod)/},
						{name: 'Windows 3.11', acronym: ['win', 'win-3-11'], pattern: /(win16)/},
						{name: 'Windows 95', acronym: ['win', 'win-95'], pattern: /(windows 95)|(win95)|(windows_95)/},
						{name: 'Windows 98', acronym: ['win', 'win-98'], pattern: /(windows 98)|(win98)/},
						{name: 'Windows 2000', acronym: ['win', 'win-2000'], pattern: /(windows nt 5\.0)|(windows 2000)/},
						{name: 'Windows XP', acronym: ['win', 'win-xp'], pattern: /(windows nt 5\.1)|(windows xp)/},
						{name: 'Windows 2003', acronym: ['win', 'win-2003'], pattern: /(windows nt 5\.2)/},
						{name: 'Windows Vista', acronym: ['win', 'win-vista'], pattern: /(windows nt 6\.0)|(windows vista)/},
						{name: 'Windows 7', acronym: ['win', 'win-7'], pattern: /(windows nt 6\.1)|(windows 7)/},
						{name: 'Windows 8', acronym: ['win', 'win-8'], pattern: /(windows nt 6\.2)|(windows nt 6\.3)|(windows 8)/},
						{name: 'Windows NT 4.0', acronym: ['win', 'win-nt-4-0'], pattern: /(windows nt 4\.0)|(winnt4\.0)/},
						{name: 'Windows ME', acronym: ['win', 'win-me'], pattern: /(windows me)/},
						{name: 'FreeBSD', acronym: 'freebsd', pattern: /(freebsd)/},
						{name: 'NetBSD', acronym: 'netbsd', pattern: /(betbsd)/},
						{name: 'OpenBSD', acronym: 'openbsd', pattern: /(openbsd)/},
						{name: 'Sun OS', acronym: 'sun-os', pattern: /(sunos)/},
						{name: 'Amiga', acronym: 'amiga', pattern: /(amiga)/},
						{name: 'IRIX', acronym: 'irix', pattern: /(irix)/},
						{name: 'Linux', acronym: 'linux', pattern: /(linux)|(x11)/},
						{name: 'Mac Apple', acronym: 'mac', pattern: /(mac_powerpc)|(macintosh)/},
						{name: 'QNX', acronym: 'qnx', pattern: /(qnx)/},
						{name: 'BeOS', acronym: 'beos', pattern: /(beos)/},
						{name: 'OS/2', acronym: 'os-2', pattern: /(os\/2)/},
						{name: 'Warp', acronym: 'warp', pattern: /(warp)/},
						{name: 'Search Bot', acronym: 'search-bot', pattern: /(nuhk)|(googlebot)|(yammybot)|(openbot)|(slurp\/cat)|(msnbot)|(ia_archiver)/}
					]
				},
				{
					type: 'navigator',
					'has-version': true,
					items: [
						{name: 'IE', acronym: 'ie', pattern: [/msie (\S+);/, /trident\/.*rv:(\S+)\)/]},
						{name: 'Firefox', acronym: 'ff', pattern: /firefox\/(\S+)/},
						{name: 'Chrome', acronym: 'wk-chr', pattern: /chrome\/(\S+)/},
						{name: 'Safari', acronym: 'wk-saf', pattern: /version\/(\S+).*?safari\//},
						{name: 'Opera', acronym: 'op', pattern: [/opera\/.*?version\/(\S+)/, /opera\/(\S+)/]}
					]
				}
			],
			identities: {
				recognizable: {
					DOM: 'html',
					attribute: 'class',
					format: function (object) {
						object['operating-system'] = _.merge(
							{},
							object['operating-system'],
							{
								acronym: (_.isArray(object['operating-system'].acronym) ? object['operating-system'].acronym : [object['operating-system'].acronym])
							}
						);
						object.navigator = _.merge(
							{},
							object.navigator,
							{
								version: (function () {
									object.navigator.versions = {
										input: (object.navigator.version || '').split('.'),
										output: []
									};
									_.each(
										object.navigator.versions.input,
										function () {
											object.navigator.versions.output.push(object.navigator.versions.input.slice(0, (arguments[1] + 1)).join('-'));
										}
									);
									delete object.navigator.versions.input;
									return object.navigator.versions.output;
								}).call(this)
							}
						);
						return object;
					}
				},
				debuggable: {
					DOM: 'document',
					attribute: 'title',
					condition: function () {
						return !!this.settings.debug;
					}
				}
			}
		};
		var _private = {
			parsed: {
				'operating-system': {},
				navigator: {}
			}
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
			this.parse.call(this);
			this.identify.call(this);
			return this;
		};

		_public.parse = function () {
			_.each(
				this.settings.environments,
				function (environment) {
					_.each(
						environment.items,
						function (item) {
							arguments.temp = {};
							arguments.temp.matched = false;
							_.each(
								(!item.pattern.length ? [item.pattern] : item.pattern),
								function (pattern) {
									this.temp.matcher = (!this.temp.matched ? (this.external.settings.emulate || window.navigator.userAgent).toLowerCase().match(pattern) : this.temp.matcher);
									this.temp.matched = ((this.temp.matcher && !this.temp.matched)  ? true : this.temp.matched);
									return this;
								}.bind(
									{
										external: this,
										temp: arguments.temp
									}
								)
							);
							if (arguments.temp.matched) {
								_private.parsed[environment.type] = {
									name: item.name,
									acronym: item.acronym,
									version: (environment['has-version'] ? arguments.temp.matcher[1] : false)
								};
							}
							delete arguments.temp;
							return this;
						}.bind(this)
					);
					return this;
				}.bind(this)
			);
			return this;
		};

		_public.identify = function () {
			_.each(
				this.settings.identities,
				function (item, type) {
					arguments.temp = {};
					arguments.temp.DOM = this.settings.DOM[item.DOM];
					if (arguments.temp.DOM.length) {
						arguments.temp.condition = (_.isUndefined(item.condition) ? true : (_.isFunction(item.condition) ? item.condition.call(this) : item.condition));
						if (arguments.temp.condition) {
							arguments.temp.attribute = (arguments.temp.DOM.attr(item.attribute) || '');
							arguments.temp.content = _.merge(
								{},
								_private.parsed,
								{
									attribute: arguments.temp.attribute
								}
							);
							arguments.temp.format = (_.isUndefined(item.format) ? arguments.temp.content : (_.isFunction(item.format) ? item.format.call(this, arguments.temp.content) : item.format));
							arguments.temp.DOM.attr(
								item.attribute,
								Mustache.render(
									this.settings.templates[type],
									arguments.temp.format
								)
							);
						}
					}
					delete arguments.temp;
					return this;
				}.bind(this)
			);
			return this;
		};

		return _public;
	}
);