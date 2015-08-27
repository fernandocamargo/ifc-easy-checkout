/* global define, ifcEvents, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Util = {
				Checkout: require('jsx!util/checkout')
			},
			Store = {
				Cart: require('jsx!store/cart')
			},
			debug = require('custom/debug'),
			LocalStorage = {
				app : require('custom/local-storage'),
				custom : {
				}
			},
			Component = {
				Widget: {
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					}
				},
				Helper: {
					Text: {
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				}
			},
			
			Props = function () {
				return {
					Title: {
						text: (this.props.label || ''),
						className: {
							title: true
						}
					},
					Actions : {
						alias: 'action',
						items: {
							close: {
								label: 'X Fechar',
								href: this.close,
								ref: 'close'
							}
						},
						ref: 'actions',
						label: 'Opções:'
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Modal',
				propTypes: {
					alias: React.PropTypes.string.isRequired,
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					)
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {					
					return this;
				},
				componentDidMount: function () {					
					return this;
				},
				componentDidUpdate : function(prevProps, prevState){					
					return this;
				},
				componentWillUnmount: function () {					
					return this;
				},
				componentWillReceiveProps: function (props) {
					var result = {};
					if(!!props.visible){
						result.visible = props.visible;
					}
					if(_.size(result)){
						this.set.state.call(
							this,
							result
						);
					}
					return this;
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'alias',
								'visible',
								'modal'
							]
						}
					};
				},
				getInitialState: function () {
					var result = {
						alias : (this.props.alias || ''),
						visible: false,
						modal : true
					};
					if(!!this.props.ref){
						result.ref = this.props.ref;
					}else{
						result.ref = 'modal';
					}
					return result;
				},
				render: function () {
					return <Component.Helper.Fieldset {...this.state}>
						{this.renders.contents.call(this)}
					</Component.Helper.Fieldset>;
				},
				renders: {
					contents: function (Wrapper) {
						return <div className="content" ref="modal-content">
								{this.renders.title.call(this)}
								{this.props.children}
								{this.renders.actions.close.call(this)}
							</div>;
					},
					title: function(){
						return <Component.Helper.Text.Legend>
							<Component.Helper.Text.Inline {...Props.call(this).Title} />
						</Component.Helper.Text.Legend>;
					},
					actions: {
						close: function(){
							return <Component.Widget.Menu.Container {...Props.call(this).Actions} />;
						}
					}
				},
				show: function(){
					this.set.state.call(
						this,
						{
							visible : true
						}
					);
					return this;
				},
				close : function(){
					this.set.state.call(
						this,
						{
							visible : false
						}
					);
					return this;
				}
			}
		);
	}
);