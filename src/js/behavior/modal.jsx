/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Component = {
				Widget: {
					Modal: require('jsx!component/widget/modal')
				}
			};

		return {
			modal: function(children, props, callback){
				var comp = <Component.Widget.Modal {..._.merge(
						{},
						(!!props ? props : {})
						)}>
						{children}
					</Component.Widget.Modal>;

				return this._callback.call(
					this,
					React.render(
						comp,
						this._getTargetDOMContainer.call(this)
					),
					callback
				);
			},
			_getTargetDOMContainer: function(){
				var id = 'external-react-contents',
					content = document.getElementById(id);
				if(!content){
					content = document.createElement('div');
					content.id = id;
					document.body.appendChild(content);
				}
				return content;
			},
			_getOffset: function(el) {
				var _x = 0;
				var _y = 0;
				while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
					_x += el.offsetLeft - el.scrollLeft;
					_y += el.offsetTop - el.scrollTop;
					el = el.offsetParent;
				}
				return { top: _y, left: _x };
			},
			_centerModal: function(el){
				$(el).center();
			}, 
			_reposStyleModal: function(contentDomNode){
				this._centerModal(contentDomNode);
			},
			_callback: function(comp, callback){
				var refs = {};
				if(comp.refs.hasOwnProperty('modal')){
					refs.modal = comp.refs['modal'];
				}
				if(comp.refs.hasOwnProperty('modal-content')){
					refs.content = comp.refs['modal-content'];
					this._reposStyleModal(React.findDOMNode(refs.content));
				}
				comp.set.state.call(
					comp,
					{
						visible: true
					}
				);
				if(!!callback && 'function' === typeof callback){
					callback.call(this, refs);
				}
				return comp;
			}
		};
	}
);