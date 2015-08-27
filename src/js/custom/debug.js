/* global define, _, $ */
define(
	function () {
		'use strict';

		var _namespace = 'debug',
			_cookie_name = 'ifc-easy-checkout-debug',
			_defaults = {},
			_root = function () {},
			_public = _root.prototype,
			_debug = false;


		_public.init = function (parent, settings) {
			this.debug = ( !!$.cookie && $.cookie(_cookie_name) === '1' ? true : _debug );

			this.namespace = _namespace;
			this.parent = (parent || this);
			this.settings = _.merge(
				{},
				_defaults,
				settings
			);

			_public.build();

			if(this.debug){
				_public.info('ifc-easy-checkout-debug loaded');
			}
		};
		_public.active = function(){
			$.cookie(_cookie_name, 1);
		};
		_public.inactive = function(){
			$.cookie(_cookie_name, 0);
		};

		_public.build = function(){

			if (Function.prototype.bind) {
				_public.log = ( !this.debug ? function(){} : Function.prototype.bind.call(console.log, console) );
				_public.info = ( !this.debug ? function(){} : Function.prototype.bind.call(console.info, console) );
				_public.warn = ( !this.debug ? function(){} : Function.prototype.bind.call(console.warn, console) );
			}else{
				_public.log = ( !this.debug ? function(){} : function() { 
						Function.prototype.apply.call(console.log, console, arguments);
					} 
				);
				_public.info = ( !this.debug ? function(){} : function() { 
						Function.prototype.apply.call(console.info, console, arguments);
					} 
				);
				_public.warn = ( !this.debug ? function(){} : function() { 
						Function.prototype.apply.call(console.warn, console, arguments);
					} 
				);
			}
		};
		
		_public.init();

		return _public;
	}
);