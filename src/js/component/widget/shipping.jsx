/* global define, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				String: require('jsx!behavior/string'),
				Validation: require('jsx!behavior/validation')
			},
			Component = {
				Helper: {
					Definition: {
						Container: require('jsx!component/helper/definition/container'),
						Description: require('jsx!component/helper/definition/description'),
						Title: require('jsx!component/helper/definition/title')
					},
					Text: {
						Anchor: require('jsx!component/helper/text/anchor'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Aside: require('jsx!component/helper/aside'),
					Fieldset: require('jsx!component/helper/fieldset'),
					Quote: require('jsx!component/helper/quote')
				},
				Widget: {
					Form: require('jsx!component/widget/form'),
					Control: require('jsx!component/widget/control'),
					Price: require('jsx!component/widget/price')
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
							text: 'Calcular o prazo de entrega. '
						},
						Anchor: {
							href: [
								this['call-to-action'].click.bind(
									this
								)
							],
							text: 'Informe o CEP'
						}
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
								label: 'CEP',
								placeholder: 'Digite seu CEP',
								type: 'text',
								value: ( Behavior.Validation.is.zip(this.props.code) ? this.props.code : ( this.props.code !== '' ? Behavior.String.toZip(this.props.code) : '' ) ),
								defaultValue: ( Behavior.Validation.is.zip(this.props.code) ? this.props.code : ( this.props.code !== '' ? Behavior.String.toZip(this.props.code) : '' ) ),
								autoComplete: 'shipping postal-code',
								mask: {
									mask: '99999-999'
								},
								rules: {
									required: true,
									zip: true
								},
								messages: {
									required: 'Campo obrigatório',
									zip: 'Por favor, informe um CEP válido'
								}
							},
							submit: {
								type: 'submit',
								defaultValue: 'OK'
							}
						}
					},

					Details: [
						{
							alias: 'type',
							label: 'Tipo',
							value: function (item) {
								return (item.friendlyName || '');
							}
						},
						{
							alias: 'time',
							label: 'Prazo',
							value: function (item) {
								return [
									'(',
									item.deliveryTime,
									' dia',
									((item.deliveryTime > 1) ? 's' : ''),
									')'
								].join(
									''
								);
							}
						},
						{
							alias: 'price',
							label: 'Valor',
							value: function (item) {
								return (item.value || 0);
							},
							component: Component.Widget.Price
						}
					]
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Shipping',
				mixins: [
					Behavior.Base
				],
				componentWillReceiveProps: function (props) {
					this.busy(false);
				},
				getInitialState: function () {
					return {
						busy : false
					};
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'busy'
							]
						}
					};
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
							{this.renders.details.container.call(
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
									ref: 'widget-shipping',
									children: children,
									disabled: ( undefined === this.state.disabled && ( !!this.props.code  || (this.props.shippingList || []).length ) ? false : this.state.disabled )
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
					details: {
						container: function () {
							return <Component.Helper.Aside {...{
								alias: 'details',
								children: (this.props.shippingList || []).map(
									this.renders.details.items.bind(
										this
									)
								)
							}} />;
						},
						items: function (item, index) {
							return <Component.Helper.Quote {...{
								children: (Props.call(this).Details || []).map(
									function (detail) {
										arguments.temp = {
											value: (!_.isFunction(detail.value) ? '' : detail.value.call(
												this,
												item
											))
										};
										arguments.temp.component = (!_.isFunction(detail.component) ? arguments.temp.value : React.createFactory(
											detail.component
										).call(
											detail.component,
											{
												value: arguments.temp.value
											}
										));
										return <Component.Helper.Definition.Container {...{
											alias: detail.alias
										}}>
											<Component.Helper.Definition.Title {...{
												children: <Component.Helper.Text.Inline {...{
													text: detail.label
												}} />
											}} />
											<Component.Helper.Definition.Description {...{
												children: <Component.Helper.Text.Inline {...{
													text: arguments.temp.component
												}} />
											}} />
										</Component.Helper.Definition.Container>;
									}
								)
							}} />;
						}
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
								code: (!data.code ? '' : data.code.replace(
									/\D/g,
									''
								))
							}
						)
					).intercept(
						function (status) {
							var errorList = {
									code : []
								},
								possibleErros = {
									code : [
										'cart.cep.invalid',
										'register.postalCode.error',
										'reserve.warehouseUnavaible',
										'ZIP_CODE_NOT_FOUND',
										'CARRIER_NOT_AVAIBLE_AT_ZIP_CODE',
										'CARRIER_NOT_FOUND_AT_ZIP_CODE',
										'WS_SHIPPING_NOT_FOUND_TO_ZIP_CODE',
										'SHIPPING_NOT_FOUND_TO_ZIP_CODE'
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
							if(this.refs.hasOwnProperty('widget-shipping')){
								refsForm = this.refs['widget-shipping'].serialize.call(this.refs['widget-shipping']);
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
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
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
				}
			}
		);
	}
);