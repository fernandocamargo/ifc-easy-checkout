/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			debug = require('custom/debug'),
			Component = {
				Helper: {
					Definition: {
						Container: require('jsx!component/helper/definition/container'),
						Description: require('jsx!component/helper/definition/description'),
						Title: require('jsx!component/helper/definition/title')
					},
					Table: {
						Cell: require('jsx!component/helper/table/cell'),
						Row: require('jsx!component/helper/table/row')
					},
					Text: {
						Anchor: require('jsx!component/helper/text/anchor'),
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Strong: require('jsx!component/helper/text/strong'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Quote: require('jsx!component/helper/quote'),
					List: {
						Unordered: require('jsx!component/helper/list/unordered'),
						Item: require('jsx!component/helper/list/item')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				},
				Widget: {
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					},
					Control: require('jsx!component/widget/control'),
					Price: require('jsx!component/widget/price')
				}
			},
			Props = function () {
				return {
					Menu: {
						Details: {
							alias: 'action',
							items: {
								remove: {
									label: (!!this.props.data.isRemoved ? 'Remover da lista' : 'Excluir' ),
									href: this.remove
								}
							},
							label: 'Opções:'
						}
					},
					Removed : {
						Details: {
							alias: 'action',
							items: {
								add: {
									label: 'Adicionar novamente',
									href: this.add
								}
							},
							label: 'Opções:'
						}
					},
					Url : [
							window.acecIndexInformation.catalogDomain,
							this.props.data.productItem.urlProductHome.slice(1),
							( this.props.data.productItem.urlProductHome.indexOf('?') > -1 ? '&' : '?'),
							'skuId=',
							this.props.data.productItem.sku
						].join(
							''
						)
				}
			};
		return React.createClass(
			{
				displayName: 'Widget.Cart.Item',
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					data: React.PropTypes.object.isRequired
				},
				mixins: [
					Behavior.Base
				],
				getInitialState: function () {
					return {
						data: (this.props.data || {})
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
				componentDidUpdate : function(){

					if(
						!!this.refs['gift-control'] &&
						!!this.refs['gift-details'] &&
							this.refs['gift-control'].hasOwnProperty('refs') && 
							this.refs['gift-control'].refs.hasOwnProperty('complement-layout')
					){
						window.ifcAppCkout.layout.tooltips( React.findDOMNode(this.refs['gift-control'].refs['complement-layout']), this.refs['gift-details'].getDOMClean(), 
							{ 
								style : {
									classes : 'details-gift-tip'
								}
							} 
						);
					}
				},
				componentWillReceiveProps: function (props) {
					var newState = {
						busy : false
					};
					if(props.hasOwnProperty('data')){
						newState.data = props.data;
					}
					this.set.state.call(this, newState);
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				remove: function () {
					if (_.isFunction(this.props.remove)) {
						this.busy(true);
						this.props.remove(
							this.state.data.productItem.sku, this.state.data
						);
					}
					return this;
				},
				gift: function (event) {
					if (_.isFunction(this.props.gift)) {
						this.busy(true);
						this.props.gift(
							this.state.data.UUID,
							event.target.checked
						);
					}
					return this;
				},
				add : function(){
					if (_.isFunction(this.props.update)) {
						this.busy(true);
						this.props.update(
							this.state.data.productItem.sku,
							1
						);
					}
					return this;
				},
				quantity: function (event) {
					if (_.isFunction(this.props.update)) {
						this.busy(true);
						if(this.refs.hasOwnProperty('widget-quantity')){
							var refsForm = this.refs['widget-quantity'].refs.control.refs;
							if(_.size(refsForm)){
								refsForm['input'].set.state.call(refsForm['input'], {
									error: false
								});
								window.ifcAppCkout.layout.tooltips(
									React.findDOMNode(refsForm['input']), 
									'',
									{
										forceHide : true
									}
								);
							}
						}
						this.props.update(
							this.state.data.productItem.sku,
							event.target.value
						).intercept(
							function (status) {
								var errorList = {
										input : []
									},
									possibleErros = {
										input : [
											'address.superpedido.quantity.changed',
											'lock.max.purchase.quantity',
											'lock.shoppingCart.max.purchase.quantity',
											'lock.shoppingCart.max.purchase.skuProdId',
											'lock.shoppingCart.max.purchase.uda',
											'lock.shoppingCart.max.quantity.skuProdId',
											'lock.shoppingCart.max.weight.restriction.title',
											'lock.shoppingCart.min.quantity.skuProdId'
										]
									},
									refsForm = {};

								if (_.size(status)){
									_.forEach(status, function(item, key){
										if (_.contains(possibleErros.input, key)) {
											errorList.input.push(item);
										}
									});
								}
								if(this.refs.hasOwnProperty('widget-quantity')){
									refsForm = this.refs['widget-quantity'].refs.control.refs;
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
					}
					return this;
				},
				hasGiftOption: function () {
					return ( !!this.state.data.productItem.wrap && this.state.data.productItem.wrap === 'Y' &&  !!this.state.data.wrap);
				},
				render: function () {
					return <Component.Helper.Table.Row {...{
						'data-sku' : this.props.data.productItem.sku,
						className : [].concat(
							[
								(!!this.props.data.isRemoved ? 'removed' : '' )
							],
							[
								(!!this.state.busy ? 'busy' : '' )
							]
						).join(' ') }}>
						{this.renders.Columns.image.call(this)}
						{this.renders.Columns.name.call(this)}
						{this.renders.Columns.removed.call(this)}
						{this.renders.Columns.gift.call(this)}
						{this.renders.Columns.quantity.call(this)}
						{this.renders.Columns.valueUnitary.call(this)}
						{this.renders.Columns.valueTotal.call(this)}
					</Component.Helper.Table.Row>;
				},
				renders : {
					udaList : {
						container : function(){
							var udasVisible = window.IFC_CKOUT_VARIABLES.cart.udas_visible,
								itens = [],
								prodUdas = {
									fields : this.props.data.productItem.prodUdasField,
									values : this.props.data.productItem.prodUdasValue
								},
								skuUdas = {
									fields : this.props.data.productItem.udasFields,
									values : this.props.data.productItem.udasValues
								};
							itens = _.merge(
								(!udasVisible.product.length && !prodUdas.fields.length ? {} : 
									_.reduce(
										udasVisible.product, 
										function (stack, name, index) {
											(
												_.contains(prodUdas.fields, name) ? 
													stack[name] = {
														'name'	: name,
														'value' : prodUdas.values[prodUdas.fields.indexOf(name)]
													}
												: 
												false
											);
											return stack;
										},
										{}
									)
								),
								(!udasVisible.sku.length  && !skuUdas.fields.length ? {} : 
									_.reduce(
										udasVisible.sku, 
										function (stack, name, index) {
											(
												_.contains(skuUdas.fields, name) ? 
													stack[name] = {
														'name'	: name,
														'value' : skuUdas.values[skuUdas.fields.indexOf(name)]
													}
												: 
												false
											);
											return stack;
										},
										{}
									)
								)
							);

							
							if(window.IFC_CKOUT_VARIABLES.cart.udas_visible.hasOwnProperty('filter') && 'function' === typeof window.IFC_CKOUT_VARIABLES.cart.udas_visible.filter){
								itens = window.IFC_CKOUT_VARIABLES.cart.udas_visible.filter(itens, this.props.data);
							}	

							return <Component.Helper.List.Unordered {...{
									alias: 'udas',
									children: _.map(itens,
										this.renders.udaList.item.bind(
											this
										)
									)
								}} />;
						},
						item : function(item, index){
							return <Component.Helper.List.Item {...{
									alias: item.name.replace(/\W/gi, '')+'-'+item.value.replace(/\W/gi, ''),
									key: index
								}}>
									<Component.Helper.Text.Strong {...{
										alias: 'name',
										text: item.name+': '
									}} />
									<Component.Helper.Text.Inline {...{
										alias: 'value',
										text: item.value
									}} />
								</Component.Helper.List.Item>;
						}
					},
					Columns : {
						image : function(){
							return <Component.Helper.Table.Cell {...{alias: 'image'}}>
								<Component.Helper.Text.Anchor {...{
										href : Props.call(this).Url
									}}>
									<figure className="image">
										<img src={this.props.data.productItem.imagesURL[this.props.data.productItem.imagesSize.indexOf(window.IFC_CKOUT_VARIABLES.cart.image_size)]} />
									</figure>
								</Component.Helper.Text.Anchor>
							</Component.Helper.Table.Cell>;
						},
						name : function(){
							return <Component.Helper.Table.Cell {...{alias: 'name'}}>
								<div className="details">
									<Component.Helper.Text.Anchor {...{
											href : Props.call(this).Url
										}}>
										<h3><span>{this.props.data.productItem.description}</span></h3>
									</Component.Helper.Text.Anchor>
									{this.renders.udaList.container.call(this)}
									<Component.Widget.Menu.Container {...Props.call(this).Menu.Details} />
								</div>
							</Component.Helper.Table.Cell>;
						},
						removed : function(){
							return (!this.props.data.isRemoved ? false : <Component.Helper.Table.Cell {...{alias: 'removed', colSpan : 10}}>
									<Component.Helper.Fieldset>
										<Component.Helper.Text.Legend>Você excluiu este produto.</Component.Helper.Text.Legend>
										<Component.Widget.Menu.Container {...Props.call(this).Removed.Details} />
									</Component.Helper.Fieldset>
								</Component.Helper.Table.Cell>
							);
						},
						gift : function(){
							return (this.props.data.isRemoved || !this.hasGiftOption.call(this) ? {} : <Component.Helper.Table.Cell {...{
										alias: 'gift',
										ref : 'gift-cell'
									}}>
									<Component.Widget.Control {...{
										change: this.gift,
										label: <Component.Widget.Price {...{
											value: ((this.props.data.wrap || {}).price || 0)
										}} />,
										name: 'gift',
										type: 'checkbox',
										defaultChecked : ((this.props.data.wrap || {}).checked || false),
										ref : 'gift-control'
									}} />
									<Component.Helper.Definition.Container {...{
											alias : 'details'
										}}>
										<Component.Helper.Definition.Title {...{
											children: <Component.Helper.Text.Inline {...{
												ref : 'gift-details',
												children: 'Marque esta opção para que o produto seja entregue com uma embalagem especial para presente.'
											}} />
										}} />
									</Component.Helper.Definition.Container>
								</Component.Helper.Table.Cell>
							);
						},
						quantity : function(){
							return (this.props.data.isRemoved ? {} : <Component.Helper.Table.Cell {...{alias: 'quantity'}}>
									<Component.Helper.Quote>
										<Component.Widget.Control {...{
											change: this.quantity,
											defaultValue: this.props.data.quantity,
											label: 'Quantidade:',
											name: 'quantity',
											type: 'number',
											maxlength : this.props.data.productItem.maximumSellingQuantity,
											disabled : !!this.state.busy,
											ref: 'widget-quantity'
										}} />
										<Component.Helper.Text.Block {...{
											className : 'detail'
										}}>
											<Component.Widget.Price value={this.props.data.productItem.unitPrice} />
											<Component.Helper.Text.Inline {...{
												text : ' | ',
												className : 'separator'
											}} />
											<Component.Helper.Text.Inline {...{
												text : this.props.data.quantity + ' '+ ( this.props.data.quantity > 1 ? 'unidades' : 'unidade' )
											}} />
										</Component.Helper.Text.Block>
									</Component.Helper.Quote>
								</Component.Helper.Table.Cell>
							);
						},
						valueUnitary : function(){
							return (this.props.data.isRemoved ? {} : <Component.Helper.Table.Cell {...{alias: 'value-unitary'}}>
									<Component.Helper.Quote>
										<Component.Helper.Definition.Container {...{alias: 'original', visible : this.props.data.productItem.fromPrice > this.props.data.productItem.unitPrice }}>
											<Component.Helper.Definition.Title>De:</Component.Helper.Definition.Title>
											<Component.Helper.Definition.Description>
												<Component.Widget.Price value={this.props.data.productItem.fromPrice} />
											</Component.Helper.Definition.Description>
										</Component.Helper.Definition.Container>
										<Component.Helper.Definition.Container {...{alias: 'final'}}>
											<Component.Helper.Definition.Title>Por:</Component.Helper.Definition.Title>
											<Component.Helper.Definition.Description>
												<Component.Widget.Price value={this.props.data.productItem.unitPrice} />
											</Component.Helper.Definition.Description>
										</Component.Helper.Definition.Container>
									</Component.Helper.Quote>
								</Component.Helper.Table.Cell>
							);
						},
						valueTotal : function(){
							return (this.props.data.isRemoved ? {} : <Component.Helper.Table.Cell {...{alias: 'value-total'}}>
									<Component.Helper.Quote>
										<Component.Helper.Definition.Container {...{alias: 'original', visible : this.props.data.baseProductTotal > this.props.data.productTotal }}>
											<Component.Helper.Definition.Title>De:</Component.Helper.Definition.Title>
											<Component.Helper.Definition.Description>
												<Component.Widget.Price value={this.props.data.baseProductTotal} />
											</Component.Helper.Definition.Description>
										</Component.Helper.Definition.Container>
										<Component.Helper.Definition.Container {...{alias: 'final'}}>
											<Component.Helper.Definition.Title>Por:</Component.Helper.Definition.Title>
											<Component.Helper.Definition.Description>
												<Component.Widget.Price value={this.props.data.productTotal} />
											</Component.Helper.Definition.Description>
										</Component.Helper.Definition.Container>
									</Component.Helper.Quote>
								</Component.Helper.Table.Cell>
							);
						}
					}
				}
			}
		);
	}
);