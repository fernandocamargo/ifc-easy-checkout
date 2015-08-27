/* global define, ifcEvents, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				String: require('jsx!behavior/string')
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
					SelectedAddress: {
						title: {
							text: "Endereço de entrega",
							alias: 'title',
							className: 'title'
						},
						options: {
							alias: 'options-selected-address',
							items: {
								change: {
									label: 'Alterar',
									href: this.allowChangeAddress,
									alias : 'change'
								},
								selectOther: {
									label: 'Selecionar outro',
									href: this.selectOtherAddresses,
									alias : 'select-other',
									disabled: (this.props.getUserAddress().length < 2)
								},
								create: {
									label: 'Cadastrar um novo',
									href: this.allowCreateAddress,
									alias : 'create'
								}
							},
						},
						Fields: {
							address: null,
							addressNr: function(value){
								return value + ' - ';
							},
							additionalInfo: function(value){
								return ( !!value ? value + ' - ' : '');
							},
							quarter: null,
							city: function(value){
								return value + ' /';
							},
							state: function(value){
								return value + ' - ';
							},
							postalCdFormatted: function(value){
								return value;
							}
						}
					},
					optionsCep : {
						alias: 'options-postalcode',
						items: {
							external: {
								label: 'Não seu meu cep',
								href: "http://correios.com.br/",
								target: "_blank",
								rel: "external",
								alias : 'external'
							},
							'insert-adress-manually' : {
								label: 'Digitar endereço',
								href: this.insertAdressManually,
								alias : 'insert-adress-manually'
							}
						},
						label: 'Opções:'
					},
					Form: {
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
							error: {}
						},
						Controls: {
							cep: {
								label: ( _.contains(this.state.insertAddressType, 'newaddress') ? 'Digite o CEP do novo endereço' : 'CEP para entrega' ),
								placeholder: 'Digite seu CEP',
								type: 'text',
								defaultValue:  (this.props.getPostalCode() || ''),
								autoComplete: 'shipping postal-code',
								mask: {
									mask: '99999-999',
								},
								rules: {
									required: true,
									zip: true
								},
								messages: {
									required: 'Campo obrigatório',
									zip: 'Por favor, informe um CEP válido'
								},
								ref: 'register-cep',
								blur: this.addressFind,
								change: this.addressFind,
								// keypress: this.addressFind,
								keyup: this.addressFind,
								complement: this.renders.form.optionsCep.bind(
									this
								)
							},
							address: {
								label: 'Endereço',
								placeholder: 'Digite seu endereço',
								type: 'text',
								defaultValue: '',
								autoComplete: 'shipping street-address',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'register-address',
								complement: this.renders.form.addressInline.bind(
									this
								)
							},
							addressNumber: {
								label: 'Número',
								placeholder: 'Número',
								type: 'text',
								defaultValue: '',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'register-number'
							},
							complement: {
								label: 'Complemento',
								placeholder: 'Casa, apartamento, etc...',
								type: 'text',
								defaultValue: '',
								autoComplete: 'shipping address-line2',
								ref: 'register-complement'
							},
							country: {
								label: 'País',
								type: 'text',
								disabled : true,
								defaultValue: 'BR',
								autoComplete: 'off',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'register-country'
							},
							state: {
								label: 'Estado',
								type: 'select',
								options : {
									values : ['', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
									titles : ['..', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
									// titles : ['Selecione...', 'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins']
								},
								// disabled : true,
								defaultValue: '',
								autoComplete: 'shipping address-level1',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório. Selecione um Estado'
								},
								ref: 'register-state'
							},
							city: {
								label: 'Cidade',
								type: 'text',
								// disabled : true,
								title: 'Para selecionar uma cidade, digite um novo CEP no campo de CEP.',
								defaultValue: '',
								autoComplete: 'shipping address-level2',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório. Selecione uma Cidade'
								},
								ref: 'register-city'
							},
							neighborhood: {
								label: 'Bairro',
								placeholder: 'Digite seu bairro',
								type: 'text',
								defaultValue: '',
								autoComplete: 'shipping neighborhood',
								rules: {
									required: true
								},
								messages: {
									required: 'Campo obrigatório'
								},
								ref: 'register-neighborhood'
							}
						}
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Auth.Adress',
				propTypes: {
					
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					this.changedCart();
					arguments.address = this.setCandidateAddress.call(this);
					return this;
				},				
				componentWillUpdate: function (nextProps, nextState) {

					if(!!nextState.candidateAddress){
						if(!_.isEqual(nextState.candidateAddress, this.state.candidateAddress) ){
							this.addressSelect.call(
								this,
								nextState.candidateAddress
							);
						}
					}
					return this;
				},
				componentDidMount: function () {
					return this;
				},
				componentDidUpdate : function(prevProps, prevState){
					this.changedCart(); // TODO revisar
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
					if(props.hasOwnProperty('objCart')){
						arguments.temp.objCart = props.objCart;
					}
					if(props.hasOwnProperty('postalCode')){
						arguments.temp.postalCode = props.postalCode;
					}

					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
					delete arguments.temp;
				},
				getInitialState: function () {
					return {
						alias: 'address',
						ref: 'form-register-address',
						name: 'widget-auth-address',
						label: (this.props.label || ''),
						userPostalCodeFinded: (this.props.getPostalCode() || ''),
						insertAddressType: 'waiting' /* none (nada deve ser exibido), 
														waiting (exibe apenas o campo de CEP para deixar o cliente inserir os valor do CEP) , 
														auto (preenchido automaticamente após digitar o CEP), 
														automanual (preenchido automaticamente após digitar o CEP, mas cliente pediu para alterar os campos), 
														allowed (não encontrou o CEP e então libera para digitação manual), 
														manual (usuário requisitou digitar todo o endereço) 

													*/
					};
				},
				changedCart: function(){
					arguments.temp = {};
					
					if(!!this.props.user){
						return this;
					}
					arguments.temp.cep = this.props.getPostalCode();
					arguments.temp.cepClean = ( ''+arguments.temp.cep || '').replace(/\D/g,'');
					if( !!arguments.temp.cepClean && arguments.temp.cepClean.length === 8 ){
						
						this.props.addressFind.call(
							this,
							{},
							{
								postalCode:  arguments.temp.cepClean
							}
						).done(
							function(ceps, response){
								this.setState({
									userPostalCodeFinded : ceps.cepClean
								});
								if(response.status && !!response.searchedAddress){
									this.insertAddressAutomatically(
										_.merge(
											ceps,
											response.searchedAddress
										),
										false,
										false
									);
									this.set.state.call(
										this,
										{
											insertAddressType: 'auto'
										}
									);
									this.props.shippingSetVisible.call(this,true);
									this.props.shippingSetEnable.call(this,true);
									this.props.submitSetEnable.call(this,true);
								}else{
									this.set.state.call(
										this,
										{
											insertAddressType: 'allowed'
										}
									);
									this.props.shippingSetVisible.call(this,false);
									this.props.submitSetEnable.call(this,false);
								}
							}.bind(
								this,
								arguments.temp
							)
						);
						if( this.refs['register-cep'] && this.refs['register-cep'].refs.control.refs.input.state.value !== arguments.temp.cep ){
							// this.refs['register-cep'].refs.control.refs.input.setState({ value: Behavior.String.toZip(arguments.temp.cep) });
							$( this.refs['register-cep'].refs.control.refs.input.setValue(Behavior.String.toZip(arguments.temp.cep)) ).val(Behavior.String.toZip(arguments.temp.cep));
							
						}
					}
					return this;
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				render: function () {
					return this.renders['default'].call(
							this,
							Component.Widget.Form
						);
				},
				renders: {
					default: function (Wrapper) {
						return <Wrapper {..._.merge(
									Props.call(this).Form.Container,
									this.state,
									{
										className: 'insert-adress-'+this.state.insertAddressType
									}
								)
							}>
							{this.renders.listAddress.selectedAddress.call(this)}
							{this.renders.form.containerControls.call(this)}
							{this.renders.form.submit.call(this)}
						</Wrapper>;
					},
					listAddress: {
						selectedAddress: function(){
							return ( !( this.state.hasOwnProperty('candidateAddress') && _.size(this.state.candidateAddress) > 0 ) ?  false : 
								<Component.Helper.Fieldset {...{
									alias: 'user-address-selected'
								}}>
									<Component.Helper.Text.Block {...Props.call(this).SelectedAddress.title} />
										
										{_.keys(Props.call(this).SelectedAddress.Fields).map(
											this.renders.listAddress.selectedAddressFields.bind(
												this,
												Props.call(this).SelectedAddress.Fields
											)
										)}
										

									<Component.Widget.Menu.Container {...Props.call(this).SelectedAddress.options} />
								</Component.Helper.Fieldset>
							);
						},
						selectedAddressFields: function (items, name, index) {
							return (!this.state.candidateAddress.hasOwnProperty(name) ? false : <Component.Helper.Text.Block {...{
								alias: name,
								className: name,
								key: index,
								text: ( _.isFunction(items[name]) ? items[name](this.state.candidateAddress[name]) : this.state.candidateAddress[name] )
							}} /> )
						}
					},
					form : {
						containerControls: function () {
							return _.keys(Props.call(this).Form.Controls).map(
								this.renders.form.controls.bind(
									this,
									Props.call(this).Form.Controls
								)
							);
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
						},
						optionsCep: function () {
							return <Component.Widget.Menu.Container {..._.merge(
								{},
								Props.call(this).optionsCep
							)} />;
						},
						submit: function(){
							return <Component.Helper.Text.Block {...{
								alias: 'address-submit',
								className: 'address-submit'
							}} >
								<Component.Helper.Text.Anchor {...{
									href : this.submit.default.bind(this),
									className: 'address-submit',
									text: 'Salvar endereço',
									ref: 'address-submit'
								}} />
							</Component.Helper.Text.Block>;
						}
					}
				},
				getLastUserAddress: function(){
					arguments.addresses = this.props.getUserAddress();
					arguments.firstAddress = {};
					if(arguments.addresses.length === 1){
						arguments.firstAddress = arguments.addresses.slice(0,1)[0];
					}else{
						arguments.firstAddress = _.reduce(
							arguments.addresses,
							function (stack, item) {
								return ( _.size(stack) ? ( item.addressId > stack.addressId ? item : stack ) : item)
							},
							{}
						);
					}
					return arguments.firstAddress;
				},
				setCandidateAddress: function(addressObj){
					if(!_.size(addressObj)){
						arguments.temp = this.getLastUserAddress();

						if(_.size(arguments.temp)){
							this.set.state.call(
								this,
								{
									insertAddressType : 'none',
									candidateAddress: arguments.temp
								}
							);
							this.props.shippingSetVisible.call(this, true);
							this.props.shippingSetEnable.call(this, !_.size(this.props.shippingSelected) );
							this.props.submitSetEnable.call(this, false);

							return arguments.temp;
						}else{
							return false;
							// nao existe cadastros de endereços
						}
					}else{
						this.set.state.call(
							this,
								{
								insertAddressType : 'none',
								candidateAddress: addressObj
							}
						);
						this.props.shippingSetVisible.call(this, true);
						this.props.shippingSetEnable.call(this, !_.size(this.props.shippingSelected) );
						this.props.submitSetEnable.call(this, false);
						return addressObj;
					}
					return false;
				},
				addressSelect: function(addressObj){
					return (!!addressObj ? this.props.addressSelect.call(
							this,
							addressObj
						) : false
					);
				},
				addressFind: function(event){

					var postalCode = (!event.target.value ? '' : event.target.value.replace(
						/\D/g,
						''
					));
					if ( !this.state.userPostalCodeFinded || this.state.userPostalCodeFinded != postalCode ){
						window.ifcAppCkout.layout.tooltips(
							React.findDOMNode(this.refs['register-cep'].refs.control.refs.input),
							'',
							{
								forceHide : true
							}
						);
						this.setState({
							userPostalCodeFinded : postalCode
						});

						if(postalCode.length === 8){							
							this.refs['register-cep'].busy.call(
								this.refs['register-cep'],
								true
							);
							this.props.addressFind.call(
								this,
								event,
								_.merge(
									arguments,
									{
										postalCode:  postalCode
									}
								)
							).intercept(
								function(status){
									var errorList = {
										cep: []
									},
									possibleErros = {
										cep: [
											'cart.cep.notfound'
										]
									};

									this.refs['register-cep'].busy.call(
										this.refs['register-cep'],
										false
									);
									if (_.size(status) && !status.status){
										_.forEach(status, function(item, key){
											if (_.contains(possibleErros.cep, key)) {
												errorList.cep.push(item);
											}
										});
									}
									if( _.size(errorList.cep) ){
										window.ifcAppCkout.layout.tooltips(
											React.findDOMNode(this.refs['register-cep'].refs.control.refs.input),
											errorList.cep,
											{
												forceShow: true,
												style: {
													classes: 'generic-error'
												}
											}
										);
									}
								}.bind(
									this
								)
							).done(
								function(cep, response){
									if(response.status && !!response.searchedAddress){
										this.insertAddressAutomatically(
											_.merge(
												{
													cep: cep,
													cepClean: postalCode
												},
												response.searchedAddress
											),
											false,
											( _.contains(this.state.insertAddressType, 'newaddress') ? false : undefined )
										);
										if(_.contains(this.state.insertAddressType, 'newaddress')){
											this.set.state.call(
												this,
												{
													insertAddressType: 'autonewaddress'
												}
											);
										}else if(!_.contains(['change'], this.state.insertAddressType)){
											this.set.state.call(
												this,
												{
													insertAddressType: 'auto'
												}
											);
											this.props.shippingSetVisible.call(this,true);
											this.props.shippingSetEnable.call(this,true);
											this.props.submitSetEnable.call(this,true);
										}
									}else{
										if(_.contains(this.state.insertAddressType, 'newaddress')){
											this.set.state.call(
												this,
												{
													insertAddressType: 'allowednewaddress'
												}
											);
										}else if(!_.contains(['change'], this.state.insertAddressType)){
											this.set.state.call(
												this,
												{
													insertAddressType: 'allowed'
												}
											);
											this.props.shippingSetVisible.call(this,false);
											this.props.submitSetEnable.call(this,false);
										}
									}
								}.bind(
									this,
									event.target.value
								)
							);
						}else{
							if(_.contains(this.state.insertAddressType, 'newaddress')){
								this.set.state.call(
									this,
									{
										insertAddressType: 'waitingnewaddress'
									}
								);
							}else if(!_.contains(['change'], this.state.insertAddressType)){
								this.set.state.call(
									this,
									{
										insertAddressType: 'waiting'
									}
								);
								this.props.shippingSetVisible.call(this,false);
								this.props.submitSetEnable.call(this,false);
							}
						}
					}
					return this;
				},
				clearAllFields: function(){
					$(this.refs['register-cep'].refs.control.refs.input.setValue('')).val(''); // to fix jquery mask
					this.refs['register-address'].refs.control.refs.input.setValue('');
					this.refs['register-city'].refs.control.refs.input.setValue('');
					this.refs['register-neighborhood'].refs.control.refs.input.setValue('');
					this.refs['register-state'].refs.control.refs.select.setValue('');
					this.refs['register-complement'].refs.control.refs.input.setValue('');
					this.refs['register-country'].refs.control.refs.input.setValue('BR');
					this.refs['register-number'].refs.control.refs.input.setValue('');

					return this;
				},
				insertAddressAutomatically: function(objectAddress, fullFormUpdate, setPostalCode){
					if(!!objectAddress){
						this.refs['register-address'].refs.control.refs.input.setValue(objectAddress.address);
						this.refs['register-city'].refs.control.refs.input.setValue(objectAddress.city);
						this.refs['register-neighborhood'].refs.control.refs.input.setValue(objectAddress.quarter);
						this.refs['register-state'].refs.control.refs.select.setValue(objectAddress.state);

						this.refs['register-address'].refs['register-addressInline'].setState({
							children: <span>
								<span className='address'>{objectAddress.address}</span>
								<span className='city'>{objectAddress.city}</span>/<span className='state'>{objectAddress.state}</span> - <span className='quarter'>{objectAddress.quarter}</span>
								<Component.Helper.Text.Anchor {...{
									alias: 'register-addressInline-change',
									text: 'Alterar',
									href: this.changeAdressManually
								}} />
							</span>
						});
						if(!!fullFormUpdate){
							arguments.temp = (objectAddress.cep || objectAddress.postalCdFormatted);
							$(this.refs['register-cep'].refs.control.refs.input.setValue( arguments.temp )).val(arguments.temp);
							this.refs['register-complement'].refs.control.refs.input.setValue( ( !!objectAddress.additionalInfo ? objectAddress.additionalInfo : '' ) );
							this.refs['register-country'].refs.control.refs.input.setValue(objectAddress.countryId);
							this.refs['register-number'].refs.control.refs.input.setValue( (!!objectAddress.addressNr ? objectAddress.addressNr : '' ) );
						}
						
						if(setPostalCode !== false){
							this.props.setPostalCode({
								code : objectAddress.cepClean || ''
							}).done(
								function(response){
								}
							);
						}
					}
					return this;
				},
				submit: {
					newAddress: function(objectAddress){
						this.busy(true);
						return Util.Checkout.Address.insert.call(
							this,
							{
								postalCd: objectAddress.cep.replace(/\D/g,''),
								address: objectAddress.address,
								addressNr: objectAddress.addressNumber,
								quarter: objectAddress.neighborhood,
								city: objectAddress.city,
								state: objectAddress.state,
								countryId: objectAddress.country,
								recipientNm: ( (this.props.user || {}).name || '' ),
								additionalInfo: objectAddress.complement
							}
						).intercept(
							function(status){
							}.bind(
								this
							)
						).always(
							function(){
								this.busy(false);
							}.bind(
								this
							)
						).done(
							function(response){
								return ( !response.status ? false : this.setCandidateAddress.call(
										this
									)
								);
							}.bind(
								this
							)
						)
					},
					updateAddress: function(objectAddress){
						this.busy(true);
						return Util.Checkout.Address.update.call(
							this,
							{
								addressId: this.state.candidateAddress.addressId,
								postalCd: objectAddress.cep.replace(/\D/g,''),
								address: objectAddress.address,
								addressNr: objectAddress.addressNumber,
								quarter: objectAddress.neighborhood,
								city: objectAddress.city,
								state: objectAddress.state,
								countryId: objectAddress.country,
								recipientNm: ( (this.props.user || {}).name || '' ),
								additionalInfo: objectAddress.complement
							}
						).intercept(
							function(status){
							}.bind(
								this
							)
						).always(
							function(){
								this.busy(false);
							}.bind(
								this
							)
						).done(
							function(response){
								return ( !response.status ? false : this.setCandidateAddress.call(
										this,
										_.reduce(
											response.customer.addresses,
											function(stack, addressObj, key){
												stack = (_.isEqual(addressObj.addressId, this.state.candidateAddress.addressId) ? addressObj : stack)
												return stack;
											}.bind(
												this
											),
											{}
										)
									)
								);
							}.bind(
								this
							)
						)
					},
					default: function (event, data) {
						if( !( _.contains(this.state.insertAddressType, 'newaddress') || _.contains(this.state.insertAddressType, 'change') ) ){
							return false;
						}
						arguments.fields = this.refs['form-register-address'].validate({}, { payback : true });
						if(!arguments.fields){
							return this;
						}
						if(_.contains(this.state.insertAddressType, 'newaddress')){
							this.submit.newAddress.call(
								this,
								arguments.fields
							);
						}else if(_.contains(this.state.insertAddressType, 'change')){
							this.submit.updateAddress.call(
								this,
								arguments.fields
							);
						}
						
						return this;
					}
				},
				insertAdressManually : function(){
					if(_.contains(this.state.insertAddressType, 'newaddress')){
						this.set.state.call(
							this,
							{
								insertAddressType: 'manualnewaddress'
							}
						)
					}else{
						this.props.shippingSetVisible.call(this,false);
						this.props.submitSetEnable.call(this,true);
						this.set.state.call(
							this,
							{
								insertAddressType: 'manual'
							}
						);
					}
				},
				changeAdressManually : function(){
					if(_.contains(this.state.insertAddressType, 'newaddress')){
						this.set.state.call(
							this,
							{
								insertAddressType: 'automanualnewaddress'
							}
						)
					}else{
						this.props.shippingSetVisible.call(this,true);
						this.props.shippingSetEnable.call(this,false);
						this.props.submitSetEnable.call(this,true);
						this.set.state.call(
							this,
							{
								insertAddressType: 'automanual'
							}
						);
					}
				},
				allowCreateAddress: function(){
					this.clearAllFields.call(
						this
					);
					this.set.state.call(
						this,
						{
							insertAddressType: 'waitingnewaddress'
						}
					);
				},
				allowChangeAddress: function(){
					this.insertAddressAutomatically(this.state.candidateAddress,true, false);
					this.props.submitSetEnable.call(this,false);
					this.set.state.call(
						this,
						{
							insertAddressType: 'change'
						}
					);
				},
				selectOtherAddresses: function(event){
					this.set.state.call(
						this,
						{
							insertAddressType: 'none'
						}
					);
					this.props.selectOtherAddresses.call(this, event);
				},
				remove: function(objectAddress){
					this.busy(true);
					return Util.Checkout.Address.remove.call(
						this,
						objectAddress.addressId
					).intercept(
						function(status){
						}.bind(
							this
						)
					).always(
						function(){
							this.busy(false);
						}.bind(
							this
						)
					).done(
						function(response){
							// return ( !response.status ? false : this.setCandidateAddress.call(
							// 		this,
							// 		_.reduce(
							// 			response.customer.addresses,
							// 			function(stack, addressObj, key){
							// 				stack = (_.isEqual(addressObj.addressId, this.state.candidateAddress.addressId) ? addressObj : stack)
							// 				return stack;
							// 			}.bind(
							// 				this
							// 			),
							// 			{}
							// 		)
							// 	)
							// );
						}.bind(
							this
						)
					)
				},
				register: {
					intercept: function(status){
						return status;
					}
				}
			}
		);
	}
);