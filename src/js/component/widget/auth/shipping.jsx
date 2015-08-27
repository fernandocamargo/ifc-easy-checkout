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
					Quote: require('jsx!component/helper/quote'),
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
					SelectedDetails: {
						Details: [
							{
								alias: 'friendlyname',
								label: 'Tipo: ',
								value: function (shipingObj) {
									return (shipingObj.friendlyName || '');
								}
							},
							{
								alias: 'deliveryTime',
								label: 'Tempo para entrega: ',
								value: function (shipingObj) {
									arguments.temp = (shipingObj.deliveryTime || 0);
									return ' ('+ ( arguments.temp > 1 ? arguments.temp + ' dias' : arguments.temp+' dia' ) + ') ';
								}
							},
							{
								alias: 'value',
								label: 'Valor: ',
								value: function (shipingObj) {
									return <Component.Widget.Price {...{
										value: (shipingObj.value || 0)
									}} />;
								}
							}
						],
						OptionsDetails : {
							alias: 'shipping-details-options',
							items: {
								change: {
									label: 'Alterar',
									href: this.allowChangeShipping,
									alias : 'change',
									disabled: !(this.props.shippingList || []).length
								}
							},
							label: 'Opções:'
						}
					},
					Form: {
						Container: {
							alias: 'shipping',
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
							ref: 'form-select-shipping',
							visible: !!this.state.visible,
							disabled: !!this.state.disabled
						},
						Controls: {
							deliveryType: {
								name: 'option-address-select',
								type: 'radio',
								options: _.reduce(
									(this.props.shippingList || []),
									function(stack, item, index){
										stack.push(
											{
												key: index,
												defaultValue: item.deliveryType, //(index + 1)
												change: this.selectDelivery.bind(this, item),
												label: <Component.Helper.Text.Inline {...{
														alias: 'option'
													}}>
													<Component.Helper.Text.Inline {...{
														alias: 'friendlyName',
														text: item.friendlyName
													}} />
													<Component.Helper.Text.Inline {...{
														alias: 'deliveryTime',
														text: [
																'(',
																item.deliveryTime,
																' dia',
																((item.deliveryTime > 1) ? 's' : ''),
																')'
															].join(
																''
															)
													}} />
													<Component.Widget.Price {...{
														value: (item.value || 0)
													}} />
												</Component.Helper.Text.Inline>
											}
										);
										return stack;
									}.bind(
										this
									),
									[]
								),
								rules: {
									required: true
								},
								messages: {
									required: 'Selecione um tipo de entrega para prosseguir'
								}
							}
						}
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Auth.Shipping',
				propTypes: {
					
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					return this;
				},				
				componentWillUpdate: function (nextProps, nextState) {
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
					if(props.hasOwnProperty('objCart')){
						arguments.temp.objCart = props.objCart;
					}
					if(props.hasOwnProperty('shippingSelected')){
						arguments.temp.shippingSelected = props.shippingSelected;
						arguments.temp.disabled = true;
					}else{
						arguments.temp.disabled = false;
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
					arguments.shippingselected = this.getshippingSelected.call(this);
					arguments.temp = {
						alias: 'shipping',
						shippingSelected: arguments.shippingselected,
						visible: true,
						disabled: (!!_.size(arguments.shippingselected))
					};

					return arguments.temp;
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
							{}
						)}>
							{this.renders.shippingSelected.call(this)}
							{this.renders.formSelectShipping.call(this)}
							
						</Wrapper>;
					},
					formSelectShipping: function(){
						return <Component.Helper.Fieldset {...{
							alias: 'shipping-form-select'
						}}>
							{this.renders.title.call(this)}
							{_.keys(Props.call(this).Form.Controls).map(
								this.renders.controls.bind(
									this,
									Props.call(this).Form.Controls
								)
							)}
						</Component.Helper.Fieldset>
					},
					shippingSelected: function(){
						//var shipping = this.getshippingSelected();
						return ( !_.size(this.props.shippingSelected) ? false : <Component.Helper.Fieldset {...{
								alias: 'shipping-selected'
							}}>
								<Component.Helper.Text.Block {...{
									alias: 'title',
									className: 'title'
								}}>
									<Component.Helper.Text.Inline {...{
										text : 'Tipo de frete',
									}} />
								</Component.Helper.Text.Block>
								<Component.Helper.Quote {...{
									alias: 'shipping-selected',
									children: (Props.call(this).SelectedDetails.Details || []).map(
										function (detail, index) {
											
											arguments.temp = {
												value: (!_.isFunction(detail.value) ? '' : detail.value.call(
													this,
													this.getshippingSelected.call(this)
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
														text: arguments.temp.component
													}} />
												}} />
											</Component.Helper.Definition.Container>;
										}.bind(this)
									)
								}} />
								<Component.Widget.Menu.Container {...Props.call(this).SelectedDetails.OptionsDetails} />
							</Component.Helper.Fieldset>
						);
					},
					title: function(){
						return ( !(this.props.shippingList || []).length ? false : <Component.Helper.Text.Block {...{
								className: 'title'
							}}>
								<Component.Helper.Text.Inline {...{
									text : "Escolha o tipo de entrega: ",
									alias: 'title'
								}} />
							</Component.Helper.Text.Block>
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
					}
				},
				getshippingSelected: function(props){
					return ( !(this.props.shippingList || []).length ? {} : _.reduce(
							this.props.shippingList,
							function(stack, item, index){
								return ( _.isEqual(item.serviceCode, this.props.shippingSelected.correiosServiceCode) ? item : stack );
							}.bind(
								this
							),
							{}
						)
					);
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				selectDelivery: function(objDelivery){
					this.props.setShipping.call(
						this,
						objDelivery
					);
				},
				allowChangeShipping: function(){
					this.set.state.call(
						this,
						{
							disabled: false
						}
					);
				},
				register: {
					intercept: function(status){
						return status;
					}
				},
				submit: function(){
				}
			}
		);
	}
);