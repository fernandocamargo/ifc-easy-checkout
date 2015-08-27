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
				Cart: require('jsx!store/cart'),
				Customer: require('jsx!store/customer'),
				Order: require('jsx!store/order')
			},
			debug = require('custom/debug'),
			LocalStorage = {
				app: require('custom/local-storage')
			},
			Component = {
				Widget: {
					Step: require('jsx!component/widget/step'),
					Payment: {
						Method: {
							Credit: require('jsx!component/widget/payment/method/credit'),
							Debit: require('jsx!component/widget/payment/method/debit'),
							Other: require('jsx!component/widget/payment/method/other'),
							Bill: require('jsx!component/widget/payment/method/Bill')
						}
					},
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					}
				},
				Helper: {
					Text: {
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				}
			},
			Props = function () {
				return {};
			};

		return React.createClass(
			{
				displayName: 'Widget.Confirmation',
				propTypes: {
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					// this.changeObjCart();
					// this.changeObjOrder();
					Util.Checkout.Order.get();
					return this;
				},
				componentDidMount: function () {
					Store.Cart.addLoadedListener(
						this.changeObjCart
					);
					Store.Cart.addChangeListener(
						this.changeObjCart
					);

					Store.Order.addChangeListener(
						this.changeObjOrder
					);

					return this;
				},
				componentWillUnmount: function () {
					Store.Cart.removeChangeListener(
						this.changeObjCart
					);
					Store.Order.removeChangeListener(
						this.changeObjOrder
					);
					return this;
				},
				componentWillUpdate: function (nextProps, nextState) {
					return this;
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						label: (this.props.label || ''),
						objOrder: Store.Order.get()
					};
				},
				render: function () {
					return this.renders['default'].call(
						this,
						Component.Widget.Step
					);
				},
				renders: {
					default: function (Wrapper) {
						return <Wrapper {...this.state}>
							<h1>Pedido Concluído:</h1>
							{this.renders.infoOrder.call(this)}
						</Wrapper>;
					},
					infoOrder: function(){
						return ( !_.size(this.state.objOrder) ? false : <div className="contentToTest" dangerouslySetInnerHTML={ {__html: this.buildList.call(this,this.state.objOrder) } }>
							</div>
						);
					}
				},
				changeObjCart: function () {
					this.set.state.call(
						this,
						{
							objCart: Store.Cart.get()
						}
					);
				},
				changeObjOrder: function () {
					this.set.state.call(
						this,
						{
							objOrder: Store.Order.get()
						}
					);
				},
				buildList: function(data){
					var html = '<ul>';
					_.forEach(
						data, 
						function(n, key){
							
							if(_.isObject(n)){
								html += '<li>';
								html += '<strong>'+key+': </strong>';
								html += this.buildList.call(this, n);
								html += '</li>';
							}else{
								html += '<li>';
								html += key+': ';
								html += n;
								html += '</li>';
							}
							
						}.bind(
							this
						)
					);
					html += '</ul>';

					return html;
				}
			}
		);
	}
);