/* global define, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Component = {
				Helper: {
					Fieldset: require('jsx!component/helper/fieldset'),
					Text: {
						Anchor: require('jsx!component/helper/text/anchor'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					List: {
						Unordered: require('jsx!component/helper/list/unordered')
					}
				},
				Widget: {
					Form: require('jsx!component/widget/form'),
					Control: require('jsx!component/widget/control'),
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
					CallToAction: {
						Container: {
							text: 'Inserir código promocional. '
						},
						Anchor: {
							href: [
								this['call-to-action'].click.bind(
									this
								)
							],
							text: (this.state.disabled ? 'Clique aqui.' : 'Fechar')
						}
					},
					OptionsCoupon : {
						alias: 'action',
						items: {
							forward: {
								label: 'Remover Cupom',
								href: [
										this['remove-coupon'].click.bind(
											this
										)
									]
							}
						},
						label: 'Opções:'
					},
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
							error: {
								// general: function (form, errors) {
								// 	return;
								// },
								// individual: function (field, errors) {
								// 	return;
								// }
							}
						},
						Controls: {
							code: {
								label: 'Cupom de desconto',
								placeholder: 'Digite aqui seu código',
								type: 'text',
								defaultValue: (this.props.code || ''),
								autoComplete: 'off',
								rules: {
									required: true
								},
								messages: {
									required: 'Insira um código de cupom válido'
								}
							},
							submit: {
								type: 'submit',
								defaultValue: 'OK'
							}
						}
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Discount',
				mixins: [
					Behavior.Base
				],
				getInitialState: function () {
					return {
						disabled: (!_.isUndefined(this.props.disabled) ? this.props.disabled : true),
						busy : false
					};
				},
				componentWillReceiveProps: function (props) {
					this.busy(false);
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				render: function () {
					return this.renders.form.container.call(
						this,
						<Component.Helper.Fieldset>
							{this.renders.title.call(
								this
							)}
							{_.keys(Props.call(this).Form.Controls).map(
								this.renders.form.controls.bind(
									this,
									Props.call(this).Form.Controls
								)
							)}
							{this.renders.optionsCoupon.container.call(
								this
							)}
						</Component.Helper.Fieldset>
					);
				},
				renders: {
					title: function () {
						return <Component.Helper.Text.Legend>
							<Component.Helper.Text.Inline {...Props.call(this).CallToAction.Container} />
							<Component.Helper.Text.Anchor {...Props.call(this).CallToAction.Anchor} />
						</Component.Helper.Text.Legend>;
					},
					form: {
						container: function (children) {
							return <Component.Widget.Form {..._.merge(
								Props.call(this).Form.Container,
								{
									children: children,
									disabled: this.state.disabled,
									busy: this.state.busy,
									ref: 'widget-discount',
								}
							)} />;
						},
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
					},
					optionsCoupon: {
						container: function () {
							return (!!!this.props.code ? !!this.props.code : <Component.Widget.Menu.Container {..._.merge(
								{},
								Props.call(this).OptionsCoupon
							)} />);
						}
					}
				},
				'call-to-action': {
					click: function () {
						this.set.state.call(
							this,
							{
								disabled: !this.state.disabled
							}
						);
					}
				},
				'remove-coupon': {
					click: function (event) {
						this.busy(true);
						this.props.remove.call(
							this,
							event,
							{
								code: this.props.code
							}
						)
					}
				},
				submit: function (event, data) {
					this.busy(true);
					this.props.submit.call(
						this,
						event,
						_.merge(
							arguments,
							{
								code: data.code
							}
						)
					).intercept(
						function (status) {
							var errorList = {
									code : []
								},
								possibleErros = {
									code : [
										'coupondu.used.in.this.login',
										'coupondu.invalid',
										'coupondu.unavailable',
										'coupondu.ineffective',
										'coupondu.loginRequired',
										'coupondu.already.added',
										'DISCOUNT_COUPON_ALREADY_USED'
									]
								},
								refsForm = {};

							if (_.size(status)){
								_.forEach(status, function(item, key){
									if (_.contains(possibleErros.code, key)) {
										errorList.code.push(item);
									}
								});
							}
							if(this.refs.hasOwnProperty('widget-discount')){
								refsForm = this.refs['widget-discount'].serialize.call(this.refs['widget-discount']);
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
							return this;
						}.bind(
							this
						)
					);
					return this;
				}
			}
		);
	}
);