/* global define, _, $, ifcEvents, Router */
define(
	function (require) {
		'use strict';
		var _deps = {
				react: require('react'),
				custom: {
					util: require('custom/util'),
					'user-agent': require('custom/user-agent'),
					//preloader: require('custom/preloader'),
					layout: require('custom/layout')
				},
				component: {
					app: require('jsx!component/app')
				}
			},
			debug = require('custom/debug'),
			_namespace = 'app',
			_root = function () {},
			_public = _root.prototype,
			_defaults = {
				router: {
					strict: false,
					html5history: true
				},
				routes: {
					'/cart/products': function () {
						_public.router.route = '/cart/products';
						
							if(!!_public.router.reactApp){
								console.log('cart called external', this);
								_public.router.reactApp.set.state.call(
									_public.router.reactApp,
									{
										'step-active' : 'cart'
									}
								);
							}
						
							console.log('cart called');
										
						return 'cart';
					},
					'/cart/login': function () {
						_public.router.route = '/cart/login';
						
							if(!!_public.router.reactApp){
								console.log('cart called external', this);
								_public.router.reactApp.set.state.call(
									_public.router.reactApp,
									{
										'step-active' : 'auth'
									}
								);
							}
						
							console.log('cart called');
											
						return 'login';
					},
					'/cart/register': function () {
						_public.router.route = '/cart/register';
						
							if(!!_public.router.reactApp){
								console.log('cart called external', this);
								_public.router.reactApp.set.state.call(
									_public.router.reactApp,
									{
										'step-active' : 'auth'
									}
								);
							}
						
							console.log('cart called');
											
						return 'register';
					},
					'/cart/payment': function () {
						_public.router.route = '/cart/payment';
						
							if(!!_public.router.reactApp){
								console.log('cart called external', this);
								_public.router.reactApp.set.state.call(
									_public.router.reactApp,
									{
										'step-active' : 'payment'
									}
								);
							}
						
							console.log('cart called');
											
						return 'payment';
					},
					'/cart/confirmation': function () {
						_public.router.route = '/cart/confirmation';
						
							if(!!_public.router.reactApp){
								console.log('cart called external', this);
								_public.router.reactApp.set.state.call(
									_public.router.reactApp,
									{
										'step-active' : 'confirmation'
									}
								);
							}
						
							console.log('cart called');
											
						return 'confirmation';
					}
				}
			},
			_DOM = {
				wrapper : $('body')
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

		_public.router = {
			route: '',
			reactApp : null,
			routes: _defaults.routes,
			app : new Router(
					_defaults.routes
				).configure(
					_defaults.router
				),
			_init: function(){
				_public.router.reactApp = this;
				_public.router.resolve.call(this);
			},
			resolve: function(route){
				var temp = {
					keys : _.keys(_public.router.routes)
				};

				_public.router.route = ( !!route ? route : '/'+_public.router.app.getRoute().join('/') );
				
				if(temp.keys.indexOf(_public.router.route) > -1){
					return _public.router.routes[_public.router.route].call(this, true);
				}
			},
			forward: function(){
				var temp = {};

				temp.routes = _.keys(_defaults.routes);
				temp.actual = '/'+_public.router.app.getRoute().join('/');
				temp.actualPos = temp.routes.indexOf(temp.actual);
				temp.next = temp.routes.slice(temp.actualPos + 1, temp.actualPos + 2);
				temp.prev = temp.routes.slice(temp.actualPos - 2, temp.actualPos - 1);

				console.group(this.constructor.displayName, 'forward();');
				
				if(temp.next.length){
					console.log(_public.router.route);
					console.log(temp);
					_public.router.app.setRoute(temp.next.join('/'));
					_public.router.resolve.call(_public.router.reactApp, true);
				}else{
					console.log(_public.router.route);
					console.log(temp);
					console.log('cruel app - next');
				}
				console.groupEnd();
			},
			rewind: function(){
				var temp = {};

				temp.routes = _.keys(_defaults.routes);
				temp.actual = '/'+_public.router.app.getRoute().join('/');
				temp.actualPos = temp.routes.indexOf(temp.actual);
				temp.next = temp.routes.slice(temp.actualPos + 1, temp.actualPos + 2);
				temp.prev = temp.routes.slice(temp.actualPos - 1, temp.actualPos);

				console.group(this.constructor.displayName, 'rewind();');
				
				if(temp.prev.length){
					console.log(_public.router.route);
					console.log(temp);
					_public.router.app.setRoute(temp.prev.join('/'));
					_public.router.resolve.call(_public.router.reactApp);
				}else{
					console.log(_public.router.route);
					console.log(temp);
					console.log('cruel app - prev');
				}
				console.groupEnd();
			}
		};

		_public.build = function () {
			
			this.util = _deps.custom.util.init(
				this,
				{}
			);
			
			ifcEvents.on('ifcAppCkout.cart.loaded', function(){
				_DOM.wrapper.addClass('app-loaded-cart');
			});
			ifcEvents.on('ifcAppCkout.app.loaded', function(){
				window.IFC_CKOUT_VARIABLES.secondsMultiplePreload = 10;
			});

			this.layout = _deps.custom.layout.init();
			_public.router.app.init();
			
			this.component = _deps.react.render(
				_deps.react.createFactory(
					_deps.component.app
				).call(
					_deps.react, 
					_public
				),
				document.getElementById('content')
			);

			/*window.setTimeout(
				function () {
					console.log('timeout();');
					this.router.setRoute(
						'/cart/login'
					);
				}.bind(
					this
				),
				5000
			);*/

			return this;
		};

		_public.ready = function () {
			//ifcEvents.emit('ifcAppCkout.preloader.complete');
			ifcEvents.emit('ifcAppCkout.app.loaded');
			debug.info('ifc-easy-checkout ready');
			return this;
		};

		return _public;
	}
);