/* global define, ifcEvents, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				Modal: require('jsx!behavior/modal'),
				String: require('jsx!behavior/string'),
				Validation: require('jsx!behavior/validation')
			},
			Util = {
				Checkout: require('jsx!util/checkout')
			},
			Store = {
				Cart: require('jsx!store/cart'),
				Customer: require('jsx!store/customer')
			},
			debug = require('custom/debug'),
			LocalStorage = {
				app : require('custom/local-storage'),
				custom : {
				}
			},
			Component = {
				Widget: {
					Step: require('jsx!component/widget/step'),
					Auth: {
						Login: require('jsx!component/widget/auth/login'),
						User: require('jsx!component/widget/auth/user'),
						RememberPass: require('jsx!component/widget/auth/remember-pass'),
						Address: require('jsx!component/widget/auth/address'),
						Shipping: require('jsx!component/widget/auth/shipping')
					},
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					},
					Control: require('jsx!component/widget/control')
				},
				Helper: {
					Text: {
						Anchor: require('jsx!component/helper/text/anchor'),
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				}
			},
			
			Props = function () {
				return {
					Modal: {
						userExist: {
							actions: {
								alias: 'action',
								items: {
									yes: {
										label: 'Usar minha conta',
										href: this.user.useMyAccount.bind(this, true)
									},
									no: {
										label: 'Continuar',
										href: this.user.useMyAccount.bind(this, false)
									}
								},
								label: 'Opções:'
							}
						}
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Auth',
				propTypes: {
					
				},
				mixins: [
					Behavior.Base,
					Behavior.Modal
				],
				componentWillMount: function () {
					this.changeObjCart();
					return this;
				},
				componentDidMount: function () {
					Store.Customer.addChangeListener(
						this.user.userExist.bind(this)
					);

					Store.Cart.addLoadedListener(
						this.changeObjCart
					);
					Store.Cart.addChangeListener(
						this.changeObjCart
					);
					return this;
				},
				componentDidUpdate : function(prevProps, prevState){
					
					return this;
				},
				componentWillUnmount: function () {
					Store.Customer.removeChangeListener(
						this.user.userExist
					);
					Store.Cart.removeChangeListener(
						this.changeObjCart
					);
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
						objCart: Store.Cart.get()
					};
				},
				changeObjCart: function () {
					this.set.state.call(
						this,
						{
							objCart: Store.Cart.get()
						}
					);
				},
				getItems: function (data) {
					return ((_.first(((data || this.state.objCart || {}).shoppingCart || {}).shoppingCartLinesOrganized || []) || {}).shoppingCartLines || []);
				},
				getAuthenticated: function (objCart) {
					arguments.temp = ( (objCart || this.state.objCart || {} ).customer || {} );
					return ( !!arguments.temp.email ? arguments.temp : false );
				},
				rewind: function () {
					this.props.router.rewind.call(this);
					return this;
				},
				forward: function () {
					this.props.router.forward.call(this);
					return this;
				},
				render: function () {
					return ( !this.getItems().length  ? false :
						this.renders['default'].call(
							this,
							Component.Widget.Step
						)
					);
				},
				renders: {
					default: function (Wrapper) {
						return <Wrapper {...this.state}>
							<div className="content">
								{this.renders.Login['remember-pass'].call(this)}
								{this.renders.Login.container.call(this)}
								{this.renders.Register.title.call(this)}
								{this.renders.User.container.call(this)}
								{this.renders.Address.container.call(this)}
								{this.renders.Shipping.container.call(this)}
								{this.renders.Submit.call(this)}
							</div>
						</Wrapper>;
					},
					User: {
						container : function(){
							return <Component.Widget.Auth.User {...{
									user: this.getAuthenticated(),
									getUserExist: this.user.getUserExist.bind(this),
									objCart: this.state.objCart,
									alias: 'auth-user',
									ref: 'user'
								}} />;
						},
						modalUserExist: function(){
							return this.modal(<div>
									<Component.Helper.Text.Block>
										<Component.Helper.Text.Inline {...{
											text : "Você já tem cadastro conosco."
										}} />
										<Component.Helper.Text.Inline {...{
											text : "Gostaria de usar sua conta? Ou continuar preenchendo os dados?"
										}} />
									</Component.Helper.Text.Block>
									<Component.Widget.Menu.Container {...Props.call(this).Modal.userExist.actions} />
								</div>,
								{
									alias : 'user-exist'
								}
							);
						}
						
					},
					Login: {
						container: function(){
							return (this.getAuthenticated() !== false ? false : <Component.Widget.Auth.Login {...{
									submit: this.login.submit.bind(this),
									objCart: this.state.objCart,
									getAuthenticated: this.getAuthenticated,
									showRemamberPass: this.login['remember-pass'].show.bind(this),
									ref: 'login'
								}} />);
						},
						'remember-pass': function(){
							return <Component.Widget.Auth.RememberPass {...{
								customer: arguments.temp,
								backToLogin: this.login['remember-pass'].rewind.bind(this),
								submit: this.login['remember-pass'].submit.bind(this),
								alias: 'customer-remember-pass',
								disabled: true,
								ref: 'remember-pass'
							}} />;
						}
					},
					Address: {
						container: function(){
							return <Component.Widget.Auth.Address {...{
								user: this.getAuthenticated(),
								addressFind: this.address.findByPostalCode,
								addressSelect: this.address.select,
								setPostalCode: this.address.setPostalCode.bind(this),
								getPostalCode: this.address.getPostalCode.bind(this),
								getUserAddress: this.address.getUserAddress.bind(this),
								postalCode: this.address.getPostalCode.call(this),
								selectOtherAddresses: this.address.modalSelectAddress.bind(this),
								shippingSetVisible : this.shipping.setVisible.bind(this),
								shippingSetEnable : this.shipping.setEnable.bind(this),
								submitSetEnable : this.submit.setEnable.bind(this),
								shippingSelected: this.shipping.getShippingSelected.call(this),
								objCart : this.state.objCart,
								ref: 'address'
							}} />;
						}
					},
					Shipping: {
						container: function(){
							return <Component.Widget.Auth.Shipping {...{
								shippingList: this.shipping.getShippingList.call(this),
								shippingSelected: this.shipping.getShippingSelected.call(this),
								setShipping: this.shipping.setShipping.bind(this),
								objCart : this.state.objCart,
								ref: 'shipping'
							}} />;
						}
					},
					Register : {
						title: function(){
							return (this.getAuthenticated() !== false ? false : <Component.Helper.Text.Block {...{
								className : 'subtitle',
								text : 'Ou preencha os dados abaixo'
							}} />)
						}
					},
					Submit: function(){
						arguments.temp = {
							hasShipping: this.shipping.getShippingList.call(this).length
						};
						return <Component.Helper.Text.Block {...{
								alias: 'auth-submit',
								className: 'auth-submit'
							}} >
								<Component.Helper.Text.Anchor {...{
								href : this.submit.default.bind(this),
								className: 'auth-submit',
								text: 'Ir para o pagamento',
								ref: 'auth-submit',
								disabled: true
							}} />
						</Component.Helper.Text.Block>;
					}
				},
				login : {
					submit: function (event, data) {
						return Util.Checkout.Customer.login(
							data.login,
							data.password
						).done(
							function(response){
								if(!!response.status){
									return ( !!this.refs.address.setCandidateAddress.call(this.refs.address) ? true /**/ : false );
								}
							}.bind(
								this
							)
						);
					},
					'remember-pass': {
						show: function(){
							this.refs['remember-pass'].set.state.call(
								this.refs['remember-pass'],
								{
									disabled: false,
									visible: true
								}
							);
							
							this.refs.login.set.state.call(
								this.refs.login,
								{
									disabled: true,
									visible: false
								}
							);
							return this;
						},
						rewind: function(){
							this.refs['remember-pass'].set.state.call(
								this.refs['remember-pass'],
								{
									disabled: true,
									visible: false
								}
							);
							this.refs.login.set.state.call(
								this.refs.login,
								{
									disabled: false,
									visible: true
								}
							);
							return this;
						},
						submit: function(event, data){
							return Util.Checkout.Customer.pass.send(
								data.emailOrDocumentNr
							);
						}
					}
				},
				user: {
					getUserExist: function(event, data){
						if(data.emailOrDocumentNr !== '' && data.emailOrDocumentNr !== this.state.userAccountValue){
							this.setState(
								{
									userAccountValue: data.emailOrDocumentNr
								}
							);
							return Util.Checkout.Customer.exist(
								data.emailOrDocumentNr
							);
						}
					},
					userExist: function(){
						arguments.temp = {
							data: Store.Customer.get()
						}
						if(!!arguments.temp.data && !!arguments.temp.data.data && !!arguments.temp.data.data.alreadyRegistered){
							this.setState(
								{
									userExistModal: this.renders.User.modalUserExist.call(this)
								}
							);
						}
					},
					useMyAccount: function(use){
						if(!use){
							if(this.state.hasOwnProperty('userExistModal')){
								this.state.userExistModal.close.call(this.state.userExistModal);
							}
						}else{
							this.refs.login.set.state.call(
								this.refs.login,
								{
									disabled: false,
									visible: true
								}
							);
							this.refs['remember-pass'].set.state.call(
								this.refs['remember-pass'],
								{
									disabled: true,
									visible: false
								}
							);
							if(this.state.hasOwnProperty('userExistModal')){
								this.state.userExistModal.close.call(this.state.userExistModal);
							}
							this.refs.login.refs['login-email'].refs.control.refs.input.setState({
								value: this.state.userAccountValue
							});

							//React.findDOMNode(this.refs.login.refs['login-password'].refs.control.refs.input).focus();
						}
						return this;
					}
				},
				address: {
					findByPostalCode: function(event, data) {
						return Util.Checkout.Address.find(
							data.postalCode
						);
					},
					select: function(data) {
						return Util.Checkout.Address.select(
							data.addressId
						);
					},
					setPostalCode: function (data) {
						return Util.Checkout.Shipping.get(
							data.code
						)
					},
					getPostalCode: function (data) {
						arguments.temp = (((data || this.state.objCart || {}).shoppingCart || {}).postalCode || '');
						return ( !!arguments.temp ? (Behavior.Validation.is.zip(arguments.temp) ? arguments.temp : Behavior.String.toZip(arguments.temp) ) : '' );
					},
					getUserAddress: function(data){
						arguments.temp = _.reduce(
							(((data || this.state.objCart || {}).customer || {}).addresses || []),
							function(stack, item, index){
								if(!!item){
									stack.push(item);
								}
								return stack;
							},
							[]
						);
						return arguments.temp;
					},
					modalSelectAddress: function(){
						arguments.actualAddressSelected = this.refs.address.state.candidateAddress;
						return this.modal(<div>
								<Component.Helper.Text.Block>
									<Component.Helper.Text.Inline {...{
										text : "Seus endereços cadastrados",
										alias: 'title'
									}} />
								</Component.Helper.Text.Block>
								<Component.Widget.Control {...{
										name: 'option-address-select',
										type: 'radio',
										options: _.reduce(
											this.address.getUserAddress.call(this),
											function(stack, item, index){
												stack.push({
													key: index,
													label: item.address + ', '+item.addressNr+' - ' + ( !!item.additionalInfo ? item.additionalInfo + ' - ' : '' ) + item.quarter + '. ' + item.city+'/'+item.state +' - CEP: '+item.postalCdFormatted,
													defaultValue: item.addressId,
													objAddress: item,
													defaultChecked: (!!arguments.actualAddressSelected && arguments.actualAddressSelected.addressId == item.addressId),
													change: this.address._modalSelectAddressComplement.bind(this, item),
													complement: <Component.Helper.Text.Anchor {...{
															className: 'delete-address',
															text: '(Excluir endereço)',
															href: this.address.remove.bind(this, item)
														}} />

												});
												return stack;
											}.bind(
												this
											),
											[]
										)
									}
								} />
							</div>,
							{
								alias : 'user-address-select'
							}
						);
					},
					_modalSelectAddressComplement: function(item){
						this.refs.address.setCandidateAddress.call(this.refs.address,item);
					},
					remove: function(item){
						this.refs.address.remove.call(this.refs.address,item);	
					}
				},
				shipping: {
					setShipping: function (data) {
						return (this.getAuthenticated() === false ? false : Util.Checkout.Shipping.set.method(
								data.serviceCode,
								false
							)
						);
					},
					setVisible: function(visible){
						return ( !!this.refs.shipping ? this.refs.shipping.set.state.call(
							this.refs.shipping,
							{
								visible: visible
							}
						) : false );
					},
					setEnable: function(enabled){
						return ( !!this.refs.shipping ? this.refs.shipping.set.state.call(
							this.refs.shipping,
							{
								disabled: !enabled
							}
						) : false );
					},
					getShippingList: function (data) {
						return  ((data || this.state.objCart || {}).freightsOptions || []);
					},
					getShippingSelected: function(data){
						return  ((data || this.state.objCart || {}).selectedFreight || {});
					}
				},
				guest: {
					register: function(objGuest){
						
						// TODO: ativar busy

						Util.Checkout.Guest.register.call(
							this,
							objGuest
						).intercept(
							function(status){
								arguments.temp = {
									status: _.reduce(
										status,
										function(stack, item, key){
											stack = ( _.contains(['status','response','success'], key) ? stack : stack[key] = item );
											return stack;
										},
										{}
									)
								};

								if(_.size(arguments.temp.status)){
									arguments.temp.status = this.refs.shipping.register.intercept.call(
										this.refs.shipping,
										this.refs.address.register.intercept.call(
											this.refs.address,
											this.refs.user.register.intercept.call(
												this.refs.user,
												arguments.temp.status
											)
										)
									);

									return arguments.temp.status;
								}

								// TODO: desativar busy

								// var errorList = {
								// 	user: {},
								// 	address: {},
								// 	shipping: {}
								// },
								// possibleErros = {
								// 	user: {
								// 		email: [
								// 			'register.email.existing',
								// 			'register.email.invalid',
								// 			'register.documentId.email.existing'
								// 		],
								// 		cpf: [
								// 			'register.documentId.invalid',
								// 			'register.documentId.required',
								// 			'register.documentId.person.invalid'
								// 		],
								// 		name: [
								// 			'register.name.length'
								// 		]
								// 	},
								// 	address: {},
								// 	shipping: {}
								// };

								// if (_.size(status)){
								// 	_.forEach(status, function(item, key){
								// 		if( !_.contains(['status','response','success'], key) ){
								// 			_.forEach(possibleErros, function(field, formType){
								// 				_.forEach(possibleErros[formType], function(fieldValues, fieldRef){
								// 					if (_.contains(fieldValues, key)) {
								// 						errorList[formType][fieldRef] = ( _.isArray(errorList[formType][fieldRef]) ? errorList[formType][fieldRef] : [] );
								// 						errorList[formType][fieldRef].push(item);
								// 					}
								// 				});
								// 			});
								// 		}
								// 	});
								// }

								return this;
							}.bind(
								this
							)
						).done(
							function(response){

								this.refs.address.setCandidateAddress.call(this.refs.address);
								this.shipping.setVisible.call(this,true);
								this.shipping.setEnable.call(this,false);
								this.submit.setEnable.call(this,false);

								return this.props.router.resolve.call(
									this.props.router.reactApp,
									'/cart/payment'
								);

							}.bind(
								this
							)
						);

						return this;
					}
				},
				submit:{
					setEnable: function(enabled){
						return ( !!this.refs['auth-submit'] ? this.refs['auth-submit'].set.state.call(
							this.refs['auth-submit'],
							{
								disabled: !enabled
							}
						) : false );
					},
					default: function(){
						return (
							this.getAuthenticated() === false ? this.submit.guest.call(this) : this.submit.customer.call(this)
						);
					},
					guestGetFormValues: function(){
						arguments.temp = {};
						return !!( arguments.temp.user = this.refs.user.refs['form-register-user'].validate({}, { payback : true }) ) ?
							( !!( arguments.temp.address = this.refs.address.refs['form-register-address'].validate({}, { payback : true }) ) ?
								( !!( arguments.temp.shipping = this.refs.shipping.refs['form-select-shipping'].validate({}, { payback : true }) ) ? 
									arguments.temp 
								: false
							) : false
						) : false
					},
					guest: function(){
						arguments.temp = this.submit.guestGetFormValues.call(this);
						
						if(!arguments.temp){
							return false;
						}
						
						return this.guest.register.call(this,
							{
								selectFreightJSON : {
									serviceCode: arguments.temp.shipping.deliveryType,
									inShopDelivery: false
								},
								registerJSON : {
									customer : {
										guest: true,
										name: arguments.temp.user.name,
										email: arguments.temp.user.email,
										documentNrString: arguments.temp.user.cpf.replace(/\D/g,''),
										// genderString: "M",
										// birthDateString: "01/01/1980",
										optInString: (!!arguments.temp.user.newsletter ? 'true' : 'false'),
										customerTpString: "PERSON",
										// smsOptInString: "false",
										// partnerOptInString: "false",
										// smsTrkOptInString: "false"
									},
									customerLogin : {
										login: arguments.temp.user.email,
										nickname: arguments.temp.user.name
									},
									homePhone : {
										areaCd: Behavior.String.separatePrefixTel(arguments.temp.user.phone)[0],
										phoneNr: Behavior.String.separatePrefixTel(arguments.temp.user.phone)[1]
									},
									address : {
										recipientNm: arguments.temp.user.name,
										postalCd: arguments.temp.address.cep.replace(/\D/g,''),
										address: arguments.temp.address.address,
										addressNr: arguments.temp.address.addressNumber,
										quarter: arguments.temp.address.neighborhood,
										city: arguments.temp.address.city,
										state: arguments.temp.address.state,
										countryId: arguments.temp.address.country,
										additionalInfo: arguments.temp.address.complement
									},
									postalCodePrefix: Behavior.String.separatePrefixZip(arguments.temp.address.cep)[0],
									postalCodeSufix: Behavior.String.separatePrefixZip(arguments.temp.address.cep)[1]
								}
							}
						);
					},
					customer: function(){
						return this;
					}
				}
			}
		);
	}
);