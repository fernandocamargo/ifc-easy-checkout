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
					Definition: {
						Container: require('jsx!component/helper/definition/container'),
						Description: require('jsx!component/helper/definition/description'),
						Title: require('jsx!component/helper/definition/title')
					},
					Text: {
						Anchor: require('jsx!component/helper/text/anchor'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend'),
						Block: require('jsx!component/helper/text/block')
					},
					Aside: require('jsx!component/helper/aside'),
					Quote: require('jsx!component/helper/quote'),
					Fieldset: require('jsx!component/helper/fieldset')
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
					User: {
						Details: [
							{
								alias: 'email',
								label: 'E-mail: ',
								value: function (user) {
									return (user.email || '');
								}
							},
							{
								alias: 'documentNr',
								label: 'CPF: ',
								value: function (user) {
									return (user.documentNr || '');
								}
							},
							{
								alias: 'phones',
								label: 'Telefone: ',
								value: function (user) {
									arguments.temp = (user.phones || []);
									return ( !arguments.temp.length ? '' : [
										'('+_.first(user.phones).areaCd + ')',
										_.first(user.phones).phoneNr
									].join(
										' '
									));
								}
							}
						],
						OptionsDetails : {
							alias: 'user-details-options',
							items: {
								// change: {
								// 	label: 'Alterar dados',
								// 	href: "#",
								// 	alias : 'change'
								// },
								// logout: {
								// 	label: 'Trocar usuário',
								// 	href: "#",
								// 	alias : 'logout'
								// }
							},
							label: 'Opções:'
						}
					},
					Form:{
						Container: {
							action: this.submit.default.bind(this),
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
							ref: 'form-register-user'
						},
						Controls : {
							email: {
								label: 'E-mail',
								placeholder: 'Digite seu E-mail',
								type: 'email',
								defaultValue: '',
								autoComplete: 'email',
								rules: {
									required: true,
									mail : true
								},
								messages: {
									required: 'Campo obrigatório',
									mail: 'Insira um e-mail válido'
								},
								blur: this.getUserExist.bind(this, 'email')
							},
							newsletter: {
								label: 'Gostaria de receber mensagens sobre ofertas',
								type: 'checkbox',
								defaultValue: 'true',
								rules: {}
							},
							name: {
								label: 'Nome completo',
								placeholder: 'Digite seu nome e sobrenome',
								type: 'text',
								defaultValue: '',
								autoComplete: 'name',
								rules: {
									required: true,
								},
								messages: {
									required: 'Insira seu nome completo'
								}
							},
							cpf: {
								label: 'CPF',
								placeholder: 'Digite seu CPF',
								type: 'text',
								defaultValue: '',
								mask: {
									mask: '999.999.999-99'
								},
								rules: {
									required: true,
									cpf : true
								},
								messages: {
									required: 'Campo obrigatório',
									mail: 'Insira um CPF válido'
								},
								ref: 'register-cpf',
								blur: this.getUserExist.bind(this, 'cpf')
							},
							phone: {
								label: 'Telefone',
								placeholder: 'Digite seu Telefone',
								type: 'tel',
								defaultValue: '',
								autoComplete: 'tel',
								mask: {
									mask: '(99) 9999-9999[9]',
									skipOptionalPartCharacter: " "
								},
								rules: {
									required: true,
									phone : true
								},
								messages: {
									required: 'Campo obrigatório',
									mail: 'Insira um Número de telefone válido'
								}
							}
							// birthDate: {
							// 	label: 'Data de nascimento',
							// 	placeholder: 'DD/MM/AAAA',
							// 	type: 'text',
							// 	defaultValue: '',
							// 	autoComplete: 'bday',
							// 	mask: {
							// 		mask: '99/99/9999',
							// 	},
							// 	rules: {
							// 		required: true
							// 	},
							// 	messages: {
							// 		required: 'Informe sua data de nascimento'
							// 	}
							// },
							// gender: {
							// 	label: 'Sexo',
							// 	type: 'radio',
							// 	options: [
							// 		{
							// 			label: 'Feminino',
							// 			defaultValue: 'F',
							// 			checked: true
							// 		},
							// 		{
							// 			label: 'Masculino',
							// 			defaultValue: 'M'
							// 		}
							// 	],
							// 	rules: {
							// 		required: true
							// 	},
							// 	messages: {
							// 		required: 'Informe seu sexo'
							// 	}
							// }
						}
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Auth.User',
				propTypes: {
					alias: React.PropTypes.string.isRequired,
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					label: React.PropTypes.string,
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
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};
					if(props.hasOwnProperty('user')){
						arguments.temp.user = props.user;
					}
					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || 'user'),
						label: (this.props.label || 'Usuário autenticado')
					};
				},
				render: function () {
					return this.renders['default'].call(
						this,
						Component.Helper.Fieldset
					);
				},
				user: {
					getFullName: function(){
						return [
								this.props.user.name
							].concat(
								[
									(!!this.props.user.lastName ? this.props.user.lastName : '')
								]
							).join(' ');
					}
				},
				renders: {
					default: function (Wrapper) {
						return ( !(!!this.props.user && this.props.user.hasOwnProperty('email') && !!this.props.user.email ) ? 
								this.renders.form.container.call(this)
							: <Wrapper {..._.merge(
									this.state,
									{
										alias: 'user-authenticated'
									}
								)}>
								{this.renders.user.name.call(this)}
								{this.renders.user.details.call(this)}
								{this.renders.user.optionsDetails.call(this)}
							</Wrapper>);
					},
					form: {
						container: function(){
							return <Component.Widget.Form {...Props.call(this).Form.Container}>
									{_.keys(Props.call(this).Form.Controls).map(
										this.renders.form.controls.bind(
											this,
											Props.call(this).Form.Controls
										)
									)}
								</Component.Widget.Form>
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
						addressInline : function(){
							return <Component.Helper.Text.Block {...{
								className : 'adressInline',
								ref: 'register-addressInline'
							}} />
						}
					},
					user: {
						name: function(){
							return <Component.Helper.Text.Block {...{
								text: this.user.getFullName.call(this),
								alias: 'user-name',
								className: 'title'
							}} />
						},
						details: function(){
							return <Component.Helper.Aside {...{
								alias: 'details',
								children: this.renders.user.items.call(
									this,
									(this.props.user || [])
								)
							}} />;
						},
						items: function (item) {
							return <Component.Helper.Quote {...{
								children: (Props.call(this).User.Details || []).map(
									function (detail, index) {
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
											alias: detail.alias,
											key: index
										}}>
											<Component.Helper.Definition.Title {...{
												children: <Component.Helper.Text.Inline {...{
													text: detail.label
												}} />
											}} />
											<Component.Helper.Definition.Description {...{
												children: <Component.Helper.Text.Inline {...{
													children: arguments.temp.component
												}} />
											}} />
										</Component.Helper.Definition.Container>;
									}.bind(this)
								)
							}} />;
						},
						optionsDetails: function(){
							return <Component.Widget.Menu.Container {..._.merge(
								{},
								Props.call(this).User.OptionsDetails
							)} />;
						}
					}
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				getUserExist: function(type, event){
					if(event.target.value !== ''){
						this.props.getUserExist.call(
							this,
							event,
							_.merge(
								arguments,
								{
									emailOrDocumentNr: (type === 'cpf' ? event.target.value.replace(/\D/g,'') : event.target.value )
								}
							)
						);
					}
					return this;
				},
				register: {
					intercept: function(status){
						var errorList = {},
							possibleErros = {
								email: [
									'register.email.existing',
									'register.email.invalid',
									'register.documentId.email.existing'
								],
								cpf: [
									// 'register.documentId.invalid',
									'register.documentId.required',
									'register.documentId.person.invalid'
								],
								name: [
									'register.name.length'
								]
							},
							refsForm = {};

						if (_.size(status)){
							_.forEach(status, function(item, key){
								_.forEach(possibleErros, function(fieldValues, fieldRef){
									if (_.contains(fieldValues, key)) {
										errorList[fieldRef] = ( _.isArray(errorList[fieldRef]) ? errorList[fieldRef] : [] );
										errorList[fieldRef].push(item);
									}
								});
							});
						}
						if(this.refs.hasOwnProperty('form-register-user')){
							refsForm = this.refs['form-register-user'].serialize.call(this.refs['form-register-user']);
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
						return status;
					}
				},
				submit: {
					default: function(){
						return this;
					}
				}
			}
		);
	}
);