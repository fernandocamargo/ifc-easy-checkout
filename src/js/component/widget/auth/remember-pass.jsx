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
							text: 'Recuperar senha'
						}
					},
					Sucess: {
						Container: {
							alias: 'remember-pass-success',
							ref: 'remember-pass-success',
							visible: false
						},
						title: {
							text: 'Confira seu email'
						},
						message: {
							text: (!!this.state.messageSucess ? this.state.messageSucess : 'Você deverá receber um e-mail com instruções para renovar sua senha nos próximos minutos.')
						}
						// options: {
						// 	alias: 'action',
						// 	items: {
						// 		back: {
						// 			label: 'Voltar para login',
						// 			href: [
						// 					this['back-login'].click.bind(
						// 						this
						// 					)
						// 				]
						// 		}
						// 	},
						// 	label: 'Opções:'
						// }
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
							ref: 'form-remember-pass',
							name: this.name(),
							method: 'post',
							busy : !!this.state.busy,
							error: {}
						},
						Controls: {
							login: {
								label: 'Se você esqueceu sua senha, digite abaixo seu email ou CPF:',
								placeholder: 'Digite seu E-mail ou CPF...',
								type: 'email',
								defaultValue: (this.state.userAccountValue || ''),
								rules: {
									required: true
								},
								messages: {
									required: 'Insira um e-mail ou CPF válido'
								}
							},
							submit: {
								type: 'submit',
								defaultValue: 'Solicitar senha'
							}
						}
					},
					OptionsForm : {
						alias: 'action',
						items: {
							back: {
								label: 'Voltar para login',
								href: [
										this['back-login'].click.bind(
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
				displayName: 'Widget.Auth.RememberPass',
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
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					this.busy(false);
				},
				getInitialState: function () {
					return {
						alias: 'remember-pass',
						disabled: (!_.isUndefined(this.props.disabled) ? this.props.disabled : true),
						label: (this.props.label || ''),
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
						return <Wrapper {..._.merge(
								this.state,
								{
									ref: 'form-remember-pass-fieldset'
								}
							)}>
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
						</Component.Helper.Text.Legend>;
					},
					form : {
						container: function (children) {
							return <Component.Widget.Form {..._.merge(
								Props.call(this).Form.Container,
								{
									disabled: this.state.disabled
								}
							)}>
								{this.renders.successMessage.container.call(
									this
								)}
								{children}
							</Component.Widget.Form>
							;
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
					successMessage: {
						container: function() {
							return <Component.Helper.Fieldset {...Props.call(this).Sucess.Container}>
								{this.renders.successMessage.title.call(
									this
								)}
								{this.renders.successMessage.message.call(
									this
								)}
							</Component.Helper.Fieldset>;
						},
						title: function() {
							return <Component.Helper.Text.Legend>
								<Component.Helper.Text.Inline {...Props.call(this).Sucess.title} />
							</Component.Helper.Text.Legend>;
						},
						message: function() {
							return <Component.Helper.Text.Block {...Props.call(this).Sucess.message} />;
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
				'back-login' : {
					click: function () {

						this.refs['form-remember-pass-fieldset'].set.state.call(
							this.refs['form-remember-pass-fieldset'],
							{
								visible: true
							}
						);
						this.refs['form-remember-pass'].set.state.call(
							this.refs['form-remember-pass'],
							{
								visible: true
							}
						);
						return this.props.backToLogin();
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
								emailOrDocumentNr: data.login
							}
						)
					).intercept(
						function (status) {
							var errorList = {
									login: []
								},
								possibleErros = {
									login: [
										'login.password.sent.error'
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
							if(this.refs.hasOwnProperty('form-remember-pass')){
								refsForm = this.refs['form-remember-pass'].serialize.call(this.refs['form-remember-pass']);
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
							if (_.size(status) && status.hasOwnProperty('login.password.sent')){
								this.set.state.call(
									this,
									{
										messageSucess: status['login.password.sent'].summary
									}
								);
								this.refs['form-remember-pass-fieldset'].set.state.call(
									this.refs['form-remember-pass-fieldset'],
									{
										visible: false
									}
								);
								this.refs['remember-pass-success'].set.state.call(
									this.refs['remember-pass-success'],
									{
										visible: true
									}
								);
								
							}
							this.busy(false);
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