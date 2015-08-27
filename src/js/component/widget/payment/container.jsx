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
							Bill: require('jsx!component/widget/payment/method/bill')
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
				return {
					Options: [
						{
							alias: 'credit',
							label: 'Cartão de crédito',
							component: Component.Widget.Payment.Method.Credit
						},
						{
							alias: 'bill',
							label: 'Boleto bancário',
							component: Component.Widget.Payment.Method.Bill
						},
						{
							alias: 'debit',
							label: 'Débito online',
							component: Component.Widget.Payment.Method.Debit
						},
						{
							alias: 'other',
							label: 'Outras formas',
							component: Component.Widget.Payment.Method.Other
						}
					],
					Menu: {
						Options: {
							alias: 'navigation-tabs',
							label: 'Opções:'
						}
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Payment',
				propTypes: {
				},
				mixins: [
					Behavior.Base
				],
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'current'
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						label: (this.props.label || ''),
						current: false
					};
				},
				rewind: function () {
					this.go.call(
						this,
						Math.max(
							0,
							(this.state.current - 1)
						)
					);
					return this;
				},
				forward: function () {
					this.go.call(
						this,
						Math.min(
							(this.state.current - 1),
							(Props.call(this).Options.length - 1)
						)
					);
					return this;
				},
				go: function (current) {
					this.setState(
						{
							current: current
						}
					);
					return this;
				},
				navigate: function (event, index) {
					this.go.call(
						this,
						index
					);
					return this;
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
							<div className="content">
								{this.renders.fragments.menu.call(
									this
								)}
								{this.renders.fragments.content.call(
									this
								)}
							</div>
						</Wrapper>;
					},
					fragments: {
						menu: function () {
							return <Component.Widget.Menu.Container {..._.merge(
								{},
								Props.call(this).Menu.Options,
								{
									items: _.reduce(
										Props.call(this).Options,
										function (stack, item, index) {
											stack[item.alias] = {
												label: item.label,
												href: {
													context: this,
													handler: this.navigate,
													params: [
														index
													]
												}
											};
											return stack;
										}.bind(
											this
										),
										{}
									)
								}
							)} />;
						},
						content: function () {
							return <div className="content-payment">
								{Props.call(this).Options.map(
									function (item, index) {
										return <item.component {...{
											key: index,
											router: this.props.router,
											nextStep: this.goToConfirmation
										}} />;
									}.bind(
										this
									)
								)}
							</div>;
						}
					}
				},
				goToConfirmation: function(orderId){
					return this.props.router.resolve.call(
						this.props.router.reactApp,
						'/cart/confirmation'+ (!!orderId ? '?order='+orderId : '')
					);
				}
			}
		);
	}
);