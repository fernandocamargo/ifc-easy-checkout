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
					deletedSkusKey : 'ifc-easy-ckout-skus-removed',
					orderItensInCart : 'ifc-easy-ckout-skus-order'
				}
			},
			Component = {
				Helper: {
					List: {
						Item: require('jsx!component/helper/list/item'),
						Unordered: require('jsx!component/helper/list/unordered')
					},
					Definition: {
						Container: require('jsx!component/helper/definition/container'),
						Description: require('jsx!component/helper/definition/description'),
						Title: require('jsx!component/helper/definition/title')
					},
					Table: {
						Body: require('jsx!component/helper/table/body'),
						Cell: require('jsx!component/helper/table/cell'),
						Column: require('jsx!component/helper/table/column'),
						Container: require('jsx!component/helper/table'),
						Header: require('jsx!component/helper/table/header'),
						Row: require('jsx!component/helper/table/row')
					},
					Text: {
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Aside: require('jsx!component/helper/aside'),
					Quote: require('jsx!component/helper/quote'),
					Form: require('jsx!component/helper/form'),
					Fieldset: require('jsx!component/helper/fieldset')
				},
				Widget: {
					Cart: {
						Item: require('jsx!component/widget/cart/item')
					},
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					},
					Discount: require('jsx!component/widget/discount'),
					Shipping: require('jsx!component/widget/shipping'),
					Step: require('jsx!component/widget/step'),
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
					Empty: {
						Container: {
							alias: 'empty'
						},
						Title: {
							text: 'Seu carrinho está vazio.'
						}
					},
					Menu: {
						Empty: {
							Action: {
								alias: 'action',
								items: {
									forward: {
										label: 'Voltar à loja',
										href: this.forward
									}
								},
								label: 'Opções:'
							}
						},
						Cart: {
							Action: {
								alias: 'action',
								items: {
									rewind: {
										label: ( (!!this.props.router.reactApp && this.props.router.reactApp.state['step-active'] !== 'cart' ) ? 'Voltar ao carrinho' : 'Adicionar mais produtos' ),
										href: this.rewind
									},
									forward: {
										label: 'Continuar',
										href: this.forward
									}
								},
								label: 'Opções:'
							}
						}
					},
					Table: {
						Form: {
							action: '/api/service/method',
							id: Template.form.id(
								{
									name: this.name(),
									id: this.id()
								}
							),
							name: this.name(),
							method: 'post'
						},
						Header: [
							{
								alias: 'image',
								label: 'Imagem'
							},
							{
								alias: 'name',
								label: 'Produto'
							},
							{
								alias: 'gift',
								label: 'Embrulhar para presente',
								ommit: function () {
									return !this.hasGiftOption.call(
										this
									);
								}
							},
							{
								alias: 'quantity',
								label: 'Quantidade'
							},
							{
								alias: 'value-unitary',
								label: 'Valor unitário'
							},
							{
								alias: 'value-total',
								label: 'Valor total'
							}
						]
					},
					Summary: [
						{
							alias: 'gift',
							label: 'Presente',
							ommit: function (item) {
								return !item.value;
							},
							value: function () {
								return this.state.data.shoppingCart.totalGiftWrap;
							}
						},
						{
							alias: 'subtotal',
							label: 'Subtotal',
							value: function () {
								return this.state.data.shoppingCart.baseProductTotal;
							}
						},
						{
							alias: 'shipping',
							label: 'Frete',
							value: function () {
								return this.state.data.shoppingCart.freight;
							},
							replace: function (item, component) {
								return (item.value ? component : 'À calcular');
							}
						},
						{
							alias: 'discount',
							label: 'Descontos',
							value: function () {
								return this.state.data.shoppingCart.totalDiscount;
							},
							ommit: function (item) {
								return !item.value;
							},
							handler: function (props) {
								return _.merge(
									props,
									{
										ref : 'sumary-discount-tip',
										'data-tooltip-content' : '>.alias-details'
									}
								);
							},
							details: [
								{
									alias: 'campaing',
									label: 'Campanha',
									value: function (item) {
										return (item.campaingName || 'Outros');
									}
								},
								{
									alias: 'id',
									label: 'Cupom',
									value: function (item) {
										return (item.couponId || '');
									}
								},
								{
									alias: 'name',
									label: 'Nome',
									value: function (item) {
										return (item.discountName || '');
									}
								},
								{
									alias: 'type',
									label: 'Tipo',
									value: function (item) {
										return (item.discountType || '');
									}
								},
								{
									alias: 'value',
									label: 'Valor',
									value: function (item) {
										return (item.discountValue || 0);
									},
									component: Component.Widget.Price
								}
							]
						},
						{
							alias: 'total',
							label: 'Total a pagar',
							value: function () {
								return this.state.data.shoppingCart.total;
							}
						}
					],
					Shipping: {
						submit: this.shipping.submit,
						code: (this.getPostalCode.call(
							this
						) || ''),
						shippingList: (this.getShippingList.call(
							this
						) || '')
					},
					Discount: {
						disabled: !!!this.getCoupons.call(
							this
						).length,
						submit: this.discount.submit,
						remove: this.discount.remove,
						code: ((_.first(this.getCoupons.call(
							this
						)) || {}).code || '')
					}
				}
			};



		return React.createClass(
			{
				displayName: 'Widget.Cart',
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
					serialize: React.PropTypes.object
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					Util.Checkout.Cart.get();
					return this;
				},
				componentDidMount: function () {
					Store.Cart.addLoadedListener(
						this.change
					);
					Store.Cart.addChangeListener(
						this.change
					);
					return this;
				},
				componentDidUpdate : function(prevProps, prevState){
					
					if(!!this.refs['sumary-discount-tip']){
						var contentTip = this.findChildrenByClassName(this.refs['sumary-discount-tip'], 'alias-details');
						if(!!contentTip && contentTip.length){
							window.ifcAppCkout.layout.tooltips(React.findDOMNode(this.refs['sumary-discount-tip']), React.renderToStaticMarkup(contentTip[0]._reactInternalInstance._currentElement), 
								{ 
									style : {
										classes : 'sumary-discount-tip'
									}
								} 
							);
						}
					}
				},
				componentWillUnmount: function () {
					Store.Cart.removeChangeListener(
						this.change
					);
					return this;
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'empty'
							]
						}
					};
				},
				getInitialState: function () {
					return {
						data: {},
						steps : {
							active : 'loading'
						},
						empty: true,
						alias: (this.props.alias || ''),
						label: (this.props.label || '')
					};
				},
				change: function () {
					arguments.temp = {
						deletedSkus : LocalStorage.app.get(LocalStorage.custom.deletedSkusKey, {}),
						orderCart : [],
						data: Store.Cart.get()
					};
					arguments.temp.empty = !!!this.getItems.call(
						this,
						arguments.temp.data
					).length;


					if(!arguments.temp.empty){
						arguments.temp.shoppingCartLines = arguments.temp.data.shoppingCart.shoppingCartLinesOrganized[0].shoppingCartLines;

						for (var sku in arguments.temp.shoppingCartLines) {
							if (arguments.temp.shoppingCartLines.hasOwnProperty(sku)) {
								// arguments.temp.shoppingCartLines[sku].orderCart = arguments.temp.orderCart.length;
								// arguments.temp.orderCart.push(arguments.temp.shoppingCartLines[sku].productItem.sku);
								if(_.size(arguments.temp.deletedSkus) && arguments.temp.deletedSkus.hasOwnProperty(arguments.temp.shoppingCartLines[sku].productItem.sku)){
									delete arguments.temp.deletedSkus[arguments.temp.shoppingCartLines[sku].productItem.sku];
								}
							}
						}
						if(_.size(arguments.temp.deletedSkus)){
							for (var sku in arguments.temp.deletedSkus) {
								if (arguments.temp.deletedSkus.hasOwnProperty(sku)) {

									// if(arguments.temp.deletedSkus[sku].hasOwnProperty('orderCart')){
									// 	arguments.temp.shoppingCartLines = arguments.temp.shoppingCartLines.slice(0, arguments.temp.deletedSkus[sku].orderCart)
									// 			.concat([arguments.temp.deletedSkus[sku]])
									// 			.concat(arguments.temp.shoppingCartLines.slice(arguments.temp.deletedSkus[sku].orderCart,arguments.temp.shoppingCartLines.length));
									// }else{
										arguments.temp.data.shoppingCart.shoppingCartLinesOrganized[0].shoppingCartLines.push(arguments.temp.deletedSkus[sku]);
									// }
								}
							}
							// arguments.temp.data.shoppingCart.shoppingCartLinesOrganized[0].shoppingCartLines = arguments.temp.shoppingCartLines;
						}
					}
					LocalStorage.app.get(LocalStorage.custom.deletedSkusKey, arguments.temp.deletedSkus);
					
					this.set.state.call(
						this,
						_.merge(
							{
								data: arguments.temp.data,
								empty: arguments.temp.empty
							},
							(
								( arguments.temp.empty === true ||  this.state.steps.active === 'loading' ) ? { steps : { active :  ( !arguments.temp.empty ?  'cart' : 'empty') } } : {}
							)
						)
					);
					delete arguments.temp;
					return this;
				},
				rewind: function () {
					this.props.router.rewind.call(this);
					return this;
				},
				forward: function () {
					this.props.router.forward.call(this);
					return this;
				},
				getHeaderColumns: function () {
					return Props.call(this).Table.Header.filter(
						function (column) {
							return !!!((!!!column.ommit || !_.isFunction(column.ommit)) ? column.ommit : column.ommit.call(
								this
							));
						}.bind(
							this
						)
					);
				},
				getItems: function (data) {
					return ((_.first(((data || this.state.data || {}).shoppingCart || {}).shoppingCartLinesOrganized || []) || {}).shoppingCartLines || []);
				},
				getCoupons: function (data) {
					return (((data || this.state.data || {}).shoppingCart || {}).couponPromotionList || []);
				},
				getPostalCode: function (data) {
					return  (((data || this.state.data || {}).shoppingCart || {}).postalCode || '');
				},
				getShippingList: function (data) {
					return  ((data || this.state.data || {}).freightsOptions || []);
				},
				hasGiftOption: function () {
					return !!_.reduce(
						this.getItems.call(
							this
						),
						function (stack, item) {
							var itemWrap = (item.productItem || {}).wrap;
							return (!(!!(item.wrap || {}) &&  ( !!itemWrap && itemWrap === 'Y' )) ? stack : stack.concat(
								item
							));
						}.bind(
							this
						),
						[]
					).length;
				},
				gift : function(sclUUID, checked){
					Util.Checkout.Gift.set(
						sclUUID,
						checked
					);
					return this;
				},
				remove: function (id, skuJson) {
					
					var deletedSkus = LocalStorage.app.get(LocalStorage.custom.deletedSkusKey, {});
					if(!!skuJson.isRemoved){
						delete deletedSkus[id];
						LocalStorage.app.set(LocalStorage.custom.deletedSkusKey, deletedSkus);
						// TODO: Atualizar conteúdo do cart
					}else{
						deletedSkus[id] = _.assign({isRemoved : true}, skuJson);
						LocalStorage.app.set(LocalStorage.custom.deletedSkusKey, deletedSkus);
						return Util.Checkout.Cart.remove(
							id
						);
					}
					return this;
				},
				update: function (id, quantity) {
					return Util.Checkout.Cart.update(
						id,
						quantity
					);
				},
				render: function () {
					return this.renders[this.state.steps.active || 'empty'].call(
						this,
						Component.Widget.Step
					);
				},
				renders: {
					loading : function(Wrapper){
						return <Wrapper {...this.state}>
						</Wrapper>;
					},
					empty: function (Wrapper) {
						
						return <Wrapper {...this.state}>
							<Component.Helper.Quote {...Props.call(this).Empty.Container}>
								<Component.Helper.Text.Block {...Props.call(this).Empty.Title} />
								{this.renders.menu.empty.action.call(
									this
								)}
							</Component.Helper.Quote>
						</Wrapper>;
					},
					cart: function (Wrapper) {
						
						return <Wrapper {...this.state}>
							<div className="content">
								{this.renders.menu.cart.action.call(
									this,
									'header'
								)}
								{this.renders.table.container.call(
									this
								)}
								<Component.Helper.Aside {...{
									alias: 'service'
								}}>
									<Component.Widget.Shipping {...Props.call(this).Shipping} />
									<Component.Widget.Discount {...Props.call(this).Discount} />
								</Component.Helper.Aside>
								{!this.state.data ? !!this.state.data : this.renders.summary.container.call(
									this
								)}
								{this.renders.menu.cart.action.call(
									this,
									'footer'
								)}
							</div>
						</Wrapper>;
					},
					table: {
						container: function () {
							return <Component.Helper.Form {...Props.call(this).Table.Form}>
								<Component.Helper.Fieldset>
									<Component.Helper.Text.Legend>Seu carrinho</Component.Helper.Text.Legend>
									<Component.Helper.Table.Container>
										{this.renders.table.header.container.call(this)}
										{this.renders.table.body.container.call(this)}
									</Component.Helper.Table.Container>
								</Component.Helper.Fieldset>
							</Component.Helper.Form>;
						},
						body: {
							container: function () {
								return <Component.Helper.Table.Body>
									{this.getItems.call(this).map(this.renders.table.body.items.bind(this))}
								</Component.Helper.Table.Body>;
							},
							items: function (data, index) {
								return <Component.Widget.Cart.Item {..._.merge(
									{},
									{
										data: data,
										key: index,
										remove: this.remove,
										update: this.update,
										gift : this.gift
									}
								)} />;
							}
						},
						header: {
							container: function () {
								return <Component.Helper.Table.Header>
									<Component.Helper.Table.Row>
										{this.getHeaderColumns.call(this).map(this.renders.table.header.items.bind(this))}
									</Component.Helper.Table.Row>
								</Component.Helper.Table.Header>;
							},
							items: function (item, index) {
								return <Component.Helper.Table.Column {..._.merge(
									{},
									{
										alias: item.alias,
										children: <Component.Helper.Text.Inline {...{
											text: item.label
										}} />,
										key: index
									}
								)} />;
							}
						}
					},
					menu: {
						empty: {
							action: function () {
								return <Component.Widget.Menu.Container {..._.merge(
									{},
									Props.call(this).Menu.Empty.Action
								)} />;
							}
						},
						cart: {
							action: function (type) {
								arguments.temp = {
									className: {}
								};
								arguments.temp.className[type] = !!type;
								return <Component.Widget.Menu.Container {..._.merge(
									{},
									arguments.temp,
									Props.call(this).Menu.Cart.Action,
									{
										key: type
									}
								)} />;
							}
						}
					},
					summary: {
						price: function (item, component) {
							return component;
						},
						items: function (item, index) {
							arguments.temp = {
								props: {
									alias: item.alias,
									key: index
								}
							};
							item.value = (!_.isFunction(item.value) ? item.value : item.value.call(
								this
							));
							item.ommit = (!_.isFunction(item.ommit) ? !!item.ommit : item.ommit.call(
								this,
								item
							));
							item.replace = (!_.isFunction(item.replace) ? this.renders.summary.price : item.replace);
							item.render = (this.renders.summary.types[item.alias] || this.noop);
							return (item.ommit ? !item.ommit : <Component.Helper.Definition.Container {...(!_.isFunction(item.handler) ? arguments.temp.props : item.handler.call(
								this,
								arguments.temp.props
							))}>
								<Component.Helper.Definition.Title {...{
									children: item.label
								}} />
								<Component.Helper.Definition.Description>
									{item.replace.call(
										this,
										item,
										<Component.Widget.Price {...{
											value: item.value
										}} />
									)}
									{item.render.call(
										this,
										item
									)}
								</Component.Helper.Definition.Description>
							</Component.Helper.Definition.Container>);
						},
						container: function () {
							return <Component.Helper.Quote {...{
								alias: 'summary',
								children: Props.call(this).Summary.map(
									this.renders.summary.items.bind(
										this
									)
								)
							}} />
						},
						types: {
							discount: function (item) {
								return <Component.Helper.Aside {...{
									alias: 'details',
									children: (this.state.data.shoppingCart.discountSummary || []).map(
										function (discount, index) {
											return <Component.Helper.Quote {...{
												alias: 'item',
												children: (item.details || []).map(
													function (detail, _index) {
														arguments.temp = {
															value: (!_.isFunction(detail.value) ? '' : detail.value.call(
																this,
																discount
															)),
															props: {
																alias: detail.alias,
																key: _index
															}
														};
														arguments.temp.component = (!_.isFunction(detail.component) ? arguments.temp.value : React.createFactory(
															detail.component
														).call(
															detail.component,
															{
																value: arguments.temp.value
															}
														));
														return <Component.Helper.Definition.Container {...arguments.temp.props}>
															<Component.Helper.Definition.Title {...{
																children: <Component.Helper.Text.Inline {...{
																	children: detail.label
																}} />
															}} />
															<Component.Helper.Definition.Description {...{
																children: <Component.Helper.Text.Inline {...{
																	children: arguments.temp.component
																}} />
															}} />
														</Component.Helper.Definition.Container>;
													}
												),
												key: index
											}} />;
										}
									)
								}} />;
							}
						}
					}
				},
				shipping: {
					submit: function (event, data) {
						return Util.Checkout.Shipping.get(
							data.code
						);
					}
				},
				discount: {
					submit: function (event, data) {
						return Util.Checkout.Discount.set(
							data.code
						);
					},
					remove : function (event, data) {
						return Util.Checkout.Discount.remove(
							data.code
						);
					}
				}
			}
		);
	}
);