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
						Legend: require('jsx!component/helper/text/legend')
					},
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
					CallToAction : {
						Container: {
							text: 'Você já tem cadastro? '
						},
						Anchor: {
							href: [
								this['call-to-action'].click.bind(
									this
								)
							],
							text: 'Clique aqui.'
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
							ref: 'form-login',
							name: this.name(),
							method: 'post',
							visible: (!!this.props.visible || true),
							busy : !!this.state.busy,
							error: {}
						},
						Controls: {
							login: {
								label: 'Entre com seu E-mail ou CPF',
								placeholder: 'Digite seu E-mail ou CPF...',
								type: 'email',
								ref: 'login-email',
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Insira um e-mail ou CPF válido'
								}
							},
							password: {
								label: 'Senha',
								placeholder: 'Digite sua senha',
								type: 'password',
								ref: 'login-password',
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Insira sua senha'
								}
							},
							submit: {
								type: 'submit',
								defaultValue: 'Entrar'
							}
						}
					},
					OptionsForm : {
						alias: 'action',
						items: {
							rememberPassword: {
								label: 'Esqueci minha senha',
								href: [
										this['remember-password'].click.bind(
											this
										)
									]
							}
						},
						label: 'Opções:'
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Auth.Login',
				propTypes: {
					
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
								'visible'
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};
					if(props.hasOwnProperty('visible')){
						arguments.temp.visible = props.visible;
					}
					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
					return this;
				},
				getInitialState: function () {
					return {
						alias: 'login',
						disabled: (!_.isUndefined(this.props.disabled) ? this.props.disabled : true),
						label: (this.props.label || ''),
						// visible: (!!this.props.label || true),
						busy : false
					};
				},
				render: function () {
					return this.renders.form.container.call(
						this,
						this.renders['default'].call(
							this,
							Component.Helper.Fieldset
						)
					);
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				renders: {
					default: function (Wrapper) {
						
						return <Wrapper {...this.state}>
							{this.renders.title.call(
								this
							)}
							{_.keys(Props.call(this).Form.Controls).map(
								this.renders.form.controls.bind(
									this,
									Props.call(this).Form.Controls
								)
							)}
							{this.renders.optionsForm.container.call(
								this
							)}
						</Wrapper>;
					},
					title : function(){
						return <Component.Helper.Text.Legend>
							<Component.Helper.Text.Inline {...Props.call(this).CallToAction.Container} />
							<Component.Helper.Text.Anchor {...Props.call(this).CallToAction.Anchor} />
						</Component.Helper.Text.Legend>;
					},
					form : {
						container: function (children) {
							return <Component.Widget.Form {..._.merge(
								Props.call(this).Form.Container,
								{
									children: children,
									disabled: this.state.disabled,
									visible: this.state.visible
								}
							)} />;
						},
						controls: function (items, name, index) {
							return <Component.Widget.Control {..._.merge(
								items[name],
								{
									key: index,
									name: name,
									busy : this.state.busy
								}
							)} />;
						}
					},
					optionsForm : {
						container: function () {
							return <Component.Widget.Menu.Container {..._.merge(
								{},
								Props.call(this).OptionsForm
							)} />;
						}
					}
				},
				'call-to-action' : {
					click: function () {
						this.set.state.call(
							this,
							{
								disabled: !this.state.disabled
							}
						);
					}
				},
				'remember-password' : {
					click: function () {
						return this.props.showRemamberPass()
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
								login: data.login,
								password: data.password
							}
						)
					).intercept(
						function (status) {
							var errorList = {
									login: [],
									password: []
								},
								possibleErros = {
									login: [
										'register.login.nonexistent',
										'salesAssistant.notempty',
										'customerLogin.nickname.notempty',
										'login.authtoken.generation.error',
										'login.user.login.invalid',
										'login.user.pass.invalid.smart',
										'salesAssistant.login.nonexistent',
										'LOYALTY_LOGIN_NOT_FOUND'
									],
									password: [
										'customerLogin.password.notempty',
										'login.user.pass.invalid',
										'salesAssistant.password.invalid',
										'salesAssistant.password.required'
									]
								},
								refsForm = {};

							if (_.size(status)){
								_.forEach(status, function(item, key){
									_.forEach(possibleErros, function(fieldValues, fieldRef){
										if (_.contains(fieldValues, key)) {
											errorList[fieldRef].push(item);
										}
									});
								});
							}
							if(this.refs.hasOwnProperty('form-login')){
								refsForm = this.refs['form-login'].serialize.call(this.refs['form-login']);
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
						function(response){
							if(response.status){
								window.ifcAppCkout.layout.clearAllTooptips();
							}
						}
					);
					return this;
				}
			}
		);
	}
);