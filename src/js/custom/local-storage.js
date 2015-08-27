/* global define, _, $ */
define(
	function () {
		'use strict';

		var _namespace = 'local-storage',
			_defaults = {},
			_root = function () {},
			_public = _root.prototype,
			_engine = $.jStorage,
			debug = require('custom/debug');


		_public.init = function (parent, settings) {
			this.namespace = _namespace;
			this.parent = (parent || this);
			this.settings = _.merge(
				{},
				_defaults,
				settings
			);

			_public.build();

		};

		_public.build = function(){

			if(!!_engine){

				_public.available 		= ( !_engine.storageAvailable 	? function(){
																			debug.warn(_namespace, 'available Unavaiable');
																			return false;
																		} : _engine.storageAvailable );
				
				_public.setTTL 			= ( !_engine.setTTL 			? function(){
																			debug.warn(_namespace, 'setTTL Unavaiable');
																			return 0;
																		} : _engine.setTTL );

				_public.getTTL 			= ( !_engine.getTTL 			? function(){
																			debug.warn(_namespace, 'getTTL Unavaiable');
																			return 0;
																		} : _engine.getTTL );

				_public.get 			= ( !_engine.get 				? function(){
																			debug.warn(_namespace, 'get Unavaiable');
																			return '';
																		} : _engine.get );
				
				_public.getKeys 		= ( !_engine.index 				? function(){
																			debug.warn(_namespace, 'getKeys Unavaiable');
																				return [];
																		} : _engine.index );

				_public.delete 			= ( !_engine.deleteKey 			? function(){
																			debug.warn(_namespace, 'delete Unavaiable');
																			return false;
																		} : _engine.deleteKey );

				_public.set 			= ( !_engine.set 				? function(){
																			debug.warn(_namespace, 'set Unavaiable');
																			return false;
																		} : _engine.set );
				
				_public.subscribe 		= ( !_engine.subscribe 			? function(){
																			debug.warn(_namespace, 'subscribe Unavaiable');
																			return false;
																		} : _engine.subscribe );
				
				_public.publish 		= ( !_engine.publish 			? function(){
																			debug.warn(_namespace, 'publish Unavaiable');
																			return false;
																		} : _engine.publish );
				
				_public.listenKeyChange = ( !_engine.listenKeyChange 	? function(){
																			debug.warn(_namespace, 'listenKeyChange Unavaiable');
																			return false;
																		} : _engine.listenKeyChange );
				
				_public.stopListening 	= ( !_engine.storageAvailable 	? function(){
																			debug.warn(_namespace, 'stopListening Unavaiable');
																			return false;
																		} : _engine.stopListening );
			}

		};
		
		_public.init();

		return _public;
	}
);