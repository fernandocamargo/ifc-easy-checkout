/* global define, _, $ */
define(
	function () {
		'use strict';
		var _namespace = 'layout',
			_root = function () {},
			_public = _root.prototype,
			_defaults = {},
			that = {
				DOM : {
					itself : $(document),
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
			
			that.footer = mainFooter();
			triggers();

			$.fn.qtip.defaults.position.viewport = true;
			$.fn.qtip.defaults.position.my = 'bottom center';
			$.fn.qtip.defaults.position.at = 'top center';
			$.fn.qtip.defaults.position.adjust.method = 'shift shift';
			$.fn.qtip.defaults.style.classes = 'qtip-easy-ckout-hint';
			
			_public.invalidAnchors();

			return this;
		};

		function triggers(){
			that.DOM.itself.on('click', function(event){
				if($(event.target).closest('#footer .navigation.menu').length === 0){
					that.footer.fn.open_close_menu();
				}
			});
		}

		function mainFooter(){
			var footer = {
				DOM : {
					itself : $('#footer')
				},
				fn : {
				}
			};
			function init(){
				footer.DOM.navigation_menu 		= footer.DOM.itself.find('.navigation.menu');
				footer.DOM.menu_drop_contents 	= footer.DOM.navigation_menu.find('.drop-content');
				event_menu();

				return footer;
			}

			function event_menu(){
				footer.DOM.navigation_menu.find('> .collection > .item > .anchor')
					.off('click.layout')
					.on('click.layout', function(event){
						event.preventDefault();
						event.stopPropagation();

						var $this = $(this),
							$item = $this.parent();
						open_close_menu($item);
					});
				footer.DOM.menu_drop_contents.find('.close')
					.off('click.layout')
					.on('click.layout', function(event){
						event.preventDefault();
						var $this = $(this),
							$item = $this.closest('.item');
						open_close_menu($item);
					});

			}

			function open_close_menu($menuItem){
				if(!!$menuItem){
					return $menuItem.toggleClass('active');
				}
				return footer.DOM.navigation_menu.find('> .collection > .item.active').removeClass('active');
			}

			footer.fn.open_close_menu = open_close_menu;

			return init();
		}

		_public.invalidAnchors = function(){
			var $a = $('a[href="#"]');
			if($a.length){
				$a.each(function(i,e){
					var $e = $(e);
					$e.on('click.preventScroll', function(event){
						event.preventDefault();
					});
				});
			}
		};

		_public.clearAllTooptips = function(){
			$('.qtip').qtip('destroy');			
		};

		_public.tooltips = function($elements, htmlContent, extraOpts){
			extraOpts = extraOpts || {};

			function get_content(objMixedToFind){
				var htmlResult = '',
					mountTipHtml = function(key, value){
						return '<definition class="definition alias-tip '+key.replace(/\W/g, '-')+'"> \
							<dt class="title"> \
								<span class="fragment">'+key+'</span> \
							</dt> \
							<dd class="description"> \
								<span class="fragment">'+value+'</span> \
							</dd> \
						</definition>';
					};
				switch (typeof objMixedToFind){
					case 'string':
						htmlResult = objMixedToFind;
						break;
					case 'function':
						htmlResult = objMixedToFind();
						break;
					case 'object':
						htmlResult = '<blockquote class="quote alias-item">';
						_.forEach(objMixedToFind, function(e, key){
							if('object' === typeof e && e.hasOwnProperty('detail') && e.hasOwnProperty('summary')){
								htmlResult += mountTipHtml(e.detail, e.summary);
							}else{
								htmlResult += mountTipHtml(key, e);
							}
						});
						htmlResult += '</blockquote>';
						break;
				}
				return htmlResult;
			}
			var opts = {
					metadata: {
						type: 'html5',
						name: 'tooltip-opts'
					},
					events: {
						visible: function(event, api) {
							var $context = $(api.target.context);
							if( $context.is('input') || $context.is('textarea') || $context.is('select') ) {
								$context.on('focus', 
									function(){
										$context.qtip('hide');
									}
								);
							}
						}
					},
					overwrite: true,
					content: {
						text: get_content(htmlContent) || function(event, api) {
							var $this = $(this),
								content,
								startWith,
								$element;
								console.log('get content tooltip');

							if (!!$this.attr('data-tooltip-content')){
								content = ( $this.attr('data-tooltip-content') || '' ).trim();
								startWith = content.slice(0,1);

								if(content.indexOf('http') > -1){ // ajax

									$.ajax({ url: content })
										.done(function(html) {
											api.set('content.text', html);
										})
										.fail(function(xhr, status, error) {
											api.set('content.text', status + ': ' + error);
										});

									return 'Carregando...';

								}else if(startWith === '>'){ // selector child
									$element = $this.find(content.slice(1));
									if($element.length){
										return $element.html();
									}
								}else if(startWith === '.' || startWith === '#'){ // selector
									$element = $(content);
									if($element.length){
										return $element.html();
									}
								}
								// conteúdo
								return content;
								
							}else if($this.attr('title')){
								return $this.attr('title');
							}
							return '';
						}
						// ,events: {
						// 	render: function(event, api) {
						// 		var $this = $(this);
						// 		if ($this.attr('data-tooltip-content')){
						// 			// Grab the overlay element
						// 			var elem = api.elements.overlay;
						// 			console.log(elem);
						// 		}
						// 		//return null;
						// 	}
						// }
					}
				};
			if(!!extraOpts){
				if(extraOpts.hasOwnProperty('style') && extraOpts.style.hasOwnProperty('classes')){
					extraOpts = _.merge(
						extraOpts,
						{
							style : {
								classes : [$.fn.qtip.defaults.style.classes, extraOpts.style.classes].join(' ')
							}
						}
					);
				}
				if(extraOpts.hasOwnProperty('forceShow')){
					extraOpts = _.merge(
						extraOpts,
						{
							show: {
								event: false
							},
							hide : {
								leave : false
							}
						}
					);
				}
			}
			opts = _.merge(
				opts,
				extraOpts
			);
			
			if(!$elements){
				return false;
			}
			if( _.isArray($elements) ){
				if($elements.length === 0){
					return false;
				}
				$.each($elements, function(i,e){
					var $this = $(e);
					if(extraOpts.hasOwnProperty('forceHide')){
						if($this.data('hasqtip')){
							$this.data('qtip').destroy();
						}
					}else{
						$this.qtip(opts);
						if(extraOpts.hasOwnProperty('forceShow')){
							$this.qtip('show');
						}
					}
				});
			}else{
				var $this = $($elements);
				if($this.length){
					if(extraOpts.hasOwnProperty('forceHide')){
						if($this.data('qtip')){
							$this.data('qtip').destroy();
						}						
					}else{
						$this.qtip(opts);
						if(extraOpts.hasOwnProperty('forceShow')){
							$this.qtip('show');
						}
					}
				}
			}

			return $elements;
		};

		_public.ready = function () {
			return this;
		};

		return _public;

	}
);