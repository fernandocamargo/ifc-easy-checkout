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
				arguments.temp = {
					years: _.reduce(
						(new Array(10)),
						function (stack, item, index) {
							stack = (_.isArray(stack) ? stack : [stack]);
							return stack.concat(
								(stack[index] + 1)
							);
						},
						(new Date()).getFullYear()
					),
					installments: ((_.first((_.first((this.state.objCart || {}).payment || []) || {}).choosedPayments || []) || {}).installments || [])
				};
				return {
					Flag: {
						unknown: '?',
						dictionary: {
							MASTERCARD: 'MASTER',
							DINERS_CLUB_INTERNATIONAL: 'DINNERS',
							DINERS_CLUB_CARTE_BLANCHE: 'DINNERS'
						}
					},
					Form: {
						Menu: {
							Value: {
								Action: {
									alias: 'action',
									items: {
										multiple: {
											label: 'Usar dois cartões',
											href: this.multiple
										}
									},
									label: 'Opções:'
								}
							}
						},
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
							ref: 'credit-card-form'
						},
						Controls: {
							number: {
								label: 'Número do cartão',
								placeholder: 'Digite o número do seu cartão',
								type: 'text',
								defaultValue: '',
								mask: {
									mask: '9999 9999 9999 9999 9999',
									placeholder: ' '
								},
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'payment-credit-number',
								keypress: this.sensor,
								paste: this.sensor,
								change: this.sensor,
								keyup: this.sensor,
								complement: this.renders.form.flag.bind(
									this
								)
							},
							value: {
								label: 'Valor',
								placeholder: 'Informe o valor',
								type: 'text',
								defaultValue: '',
								ref: 'payment-credit-value',
								complement: this.renders.form.menu.value.bind(
									this
								)
							},
							name: {
								label: 'Nome impresso no cartão',
								placeholder: 'Digite o nome',
								type: 'text',
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'payment-credit-name'
							},
							'validity-month': {
								label: 'Validade',
								type: 'select',
								options: {
									values : ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
									titles : ['Mês', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
								},
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório. Selecione um mês'
								},
								ref: 'payment-credit-validity-month'
							},
							'validity-year': {
								label: 'Validade',
								type: 'select',
								options: {
									values : [
										''
									].concat(
										arguments.temp.years
									),
									titles : [
										'Ano'
									].concat(
										arguments.temp.years
									)
								},
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório. Selecione um ano'
								},
								ref: 'payment-credit-validity-year'
							},
							'installment': {
								label: 'Selecione o número de parcelas',
								type: 'select',
								options: {
									values : (!!!arguments.temp.installments.length ? ['',''] : [''].concat(
										_.reduce(
											arguments.temp.installments,
											function (stack, item, index) {
												return stack.concat(
													item.quantity
												);
											}.bind(
												this
											),
											[]
										)
									)),
									titles : (!!!arguments.temp.installments.length ? ['...','Informe o número do cartão primeiramente'] : ['Selecione o parcelamento...'].concat(
										_.reduce(
											arguments.temp.installments,
											function (stack, item, index) {
												return stack.concat(
													<Component.Helper.Text.Inline>
														<Component.Helper.Text.Inline {...{
															alias: 'quantity',
															text: item.quantity
														}} />
														<Component.Helper.Text.Inline {...{
															alias: 'separator',
															text: 'x de '
														}} />
														<Component.Widget.Price {...{
															alias: 'value',
															value: (item.installmentValue || 0)
														}} />
														{((item.taxRate > 0) ? !!!item.taxRate : <Component.Helper.Text.Inline {...{
															alias: 'tax',
															text: ' s/ juros'
														}} />)}
													</Component.Helper.Text.Inline>
												);
											}.bind(
												this
											),
											[]
										)
									))
								},
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório. Selecione a quantidade da parcelas'
								},
								ref: 'payment-credit-installment'
							},
							code: {
								label: 'Cód. segurança',
								placeholder: 'Digite o código',
								type: 'text',
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'payment-credit-code'
							},
							agreement: {
								label: 'Concordo com a Política de trocas e cancelamentos',
								type: 'checkbox',
								defaultChecked: false,
								change: this.agreement,
								ref : 'payment-credit-agreement'
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
				displayName: 'Widget.Payment.Method.Credit',
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					this.changeObjCart();
					return this;
				},
				componentWillUnmount: function () {
					Store.Cart.removeChangeListener(
						this.changeObjCart
					);
					return this;
				},
				componentDidMount: function () {
					Store.Cart.addLoadedListener(
						this.changeObjCart
					);
					Store.Cart.addChangeListener(
						this.changeObjCart
					);
					return this;
				},
				componentWillUpdate: function (nextProps, nextState) {
					if (nextState.flag != '?' && nextState.flag && !_.isEqual(nextState.flag, this.state.flag)) {
						this.flag.call(
							this,
							nextState.flag
						);
					}
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
							alias : 'card'
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
						menu: {
							value: function () {
								return <Component.Widget.Menu.Container {...Props.call(this).Form.Menu.Value.Action} />;
							}
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
						},
						flag: function () {
							return <Component.Helper.Text.Inline {...{
										alias: 'flag',
										text: this.state.flag
									}} />;
						}
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
				sensor: function (event) {
					arguments.temp = {
						value: (event.target.value || '').toString(),
						input: ((((window.IFC_CKOUT_VARIABLES || {}).payment || {}).credit_cards_bins || {}).items || [])
					};
					arguments.temp.output = _.reduce(
						arguments.temp.input,
						function (stack, item) {
							arguments.temp = {
								match: !!_.reduce(
									_.map(
										item.begin,
										String
									),
									function (_stack, pattern) {
										arguments.temp = {
											match: _.isEqual(
												pattern,
												this.temp.value.substring(
													0,
													pattern.length
												)
											)
										};
										return (!arguments.temp.match ? _stack : _stack.concat(
											pattern
										));
									}.bind(
										this
									),
									[]
								).length
							};
							return (!arguments.temp.match ? stack : stack.concat(
								item.name
							));
						}.bind(
							{
								root: this,
								temp: arguments.temp
							}
						),
						[]
					);
					this.set.state.call(
						this,
						{
							flag: (!_.size(arguments.temp.output) ? Props.call(this).Flag.unknown : _.first(arguments.temp.output))
						}
					);
					return this;
				},
				multiple: function (event) {
					return this;
				},
				busy: function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				submit: function (event, data) {
					return Util.Checkout.Order.create.card(
						{
							number: data.number.replace(/\D/g,''),
							cardOwnersName: data.name,
							expirationMonthDate: data['validity-month'].replace(/\D/g,''),
							expirationYearDate: data['validity-year'].replace(/\D/g,''),
							cardSecurityCode: data.code.replace(/\D/g,''),
							installmentQuantity: data.installment
						}
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
				flag: function (key) {
					arguments.temp = Props.call(this).Flag.dictionary;
					return Util.Checkout.Payment.set(
						(arguments.temp.hasOwnProperty(key) ? arguments.temp[key] : key )
					);
				},
				response: function (data) {
					this[((!!data.status && !!data.orderId) ? 'success' : 'error')].call(
						this
					);
					return this;
				},
				success: function () {
					return this.props.nextStep.call(this);
				},
				error: function () {
					return this;
				}
			}
		);
	}
);