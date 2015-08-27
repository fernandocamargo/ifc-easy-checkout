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
				Helper: {
					Text: {
						Inline: require('jsx!component/helper/text/inline')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				},
				Widget: {
					Form: require('jsx!component/widget/form'),
					Control: require('jsx!component/widget/control'),
					Price: require('jsx!component/widget/price'),
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					}
				}
			},
			Template = {
				form: {
					id: Mustache.compile(
						'{{name}}[{{id}}]'
					)
				}
			},
			Props = function () {
				return {
					Form: {
						Container: {
							action: this.submit,
							id: Template.form.id(
								{
									name: this.name(),
									id: this.id()
								}
							),
							name: this.name(),
							method: 'post',
							busy : !!this.state.busy,
							error: {},
							ref: 'other-form'
						},
						Controls: {
							agreement: {
								label: 'Concordo com a Política de trocas e cancelamentos',
								type: 'checkbox',
								defaultValue: 'BILL_ITAU',
								defaultChecked: false,
								change: this.agreement,
								ref: 'payment-other-agreement',
								rules: {
									required: true
								},
								messages: {
									required: 'Você deve aceitar os termos'
								}
							},
							submit: {
								type: 'submit',
								defaultValue: 'Continuar'
							}
						}
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Payment.Method.Other',
				mixins: [
					Behavior.Base
				],
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
						flag: (this.props.flag || '')
					};
				},
				render: function () {
					return <Component.Widget.Form {..._.merge(
						Props.call(this).Form.Container,
						{
							disabled: this.state.disabled
						}
					)}>
						<Component.Helper.Fieldset {...{
							alias : 'other'
						}}>
							{_.keys(Props.call(this).Form.Controls).map(
								this.renders.form.controls.bind(
									this,
									Props.call(this).Form.Controls
								)
							)}
						</Component.Helper.Fieldset>
					</Component.Widget.Form>;
				},
				renders: {
					form: {
						controls: function (items, name, index) {
							return <Component.Widget.Control {..._.merge(
								{},
								items[name],
								{
									key: index,
									name: name,
									busy : this.state.busy
								}
							)} />;
						}
					}
				},
				busy: function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				submit: function (event, data) {
					return Util.Checkout.Order.create.other(
						data.agreement
					).intercept(
						function (status) {
							


							var errorList = {},
								possibleErros = {
									number: [
										'payment.invalid.card.number',
										'payment.invalid.card.bin',
										'payment.select.one.credit.card',
										'payment.invalid.option'
									],
									name: [
										'payment.invalid.card.owner'
									],
									'validity-month': [
										'payment.invalid.card.date'
									],
									code: [
										'payment.invalid.security.code'
									],
									installment: [
										'payment.invalid.installment.option'
									]
								},
								refsForm = {};

							if (_.size(status)){
								_.forEach(status, function(item, key){
									_.forEach(possibleErros, function(fieldValues, fieldRef){
										if (_.contains(fieldValues, key)) {
											errorList[fieldRef] = ( errorList.hasOwnProperty(fieldRef) ? errorList[fieldRef] : [] );
											errorList[fieldRef].push(item);
										}
									});
								});
							}
							if(this.refs.hasOwnProperty('credit-card-form')){
								refsForm = this.refs['credit-card-form'].serialize.call(this.refs['credit-card-form']);
								if(_.size(refsForm)){
									_.forEach(errorList, function(err, fieldRef){
										if(err.length && refsForm.hasOwnProperty(fieldRef)){
											refsForm[fieldRef].set.state.call(refsForm[fieldRef], {
												error: true
											});

											window.ifcAppCkout.layout.tooltips(
												React.findDOMNode(refsForm[fieldRef]),
												err,
												{
													forceShow: true,
													style: {
														classes: 'generic-error'
													}
												}
											);
										}
									});
								}
							}
							this.busy(false);
							return this;
						}.bind(
							this
						)
					).done(
						this.response.bind(
							this
						)
					);
				},
				agreement: function (event) {
					return Util.Checkout.Customer.agree(
						event.target.checked
					);
				},
				response: function (data) {
					this[((!!data.status && !!data.orderId) ? 'success' : 'error')].call(
						this
					);
					return this;
				},
				success: function () {
					console.log('success();');
					return this.props.nextStep.call(this);
				},
				error: function () {
					console.log('error();');
					return this;
				}
			}
		);
	}
);