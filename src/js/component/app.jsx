/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Store = {
				Cart: require('jsx!store/cart')
			},
			Component = {
				Widget: {
					Cart: {
						Container: require('jsx!component/widget/cart/container')
					},
					Auth: {
						Container: require('jsx!component/widget/auth/container')	
					},
					Payment: {
						Container: require('jsx!component/widget/payment/container')	
					},
					Confirmation: {
						Container: require('jsx!component/widget/confirmation/container')	
					},
					Step: require('jsx!component/widget/step')
				},
				Helper: {
					Section: require('jsx!component/helper/section')
				}
			},
			Props = function () {
				return {
					Cart: {
						alias: 'cart',
						label: 'Seu carrinho',
						router: this.props.router
					},
					Auth: {
						alias: 'auth',
						label: 'Identificação',
						router: this.props.router
					},
					Payment: {
						alias: 'payment',
						label: 'Pagamento',
						router: this.props.router
					},
					Confirmation: {
						alias: 'confirmation',
						label: 'Confirmação',
						router: this.props.router
					}
				};
			};

		return React.createClass(
			{
				displayName: 'App',
				mixins: [
					Behavior.Base
				],
				getInitialState: function () {
					arguments.temp = {
						router : this.props.router,
						className: {
							container: true
						}
					};
					return arguments.temp;
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'step-active'
							]
						}
					}
				},
				componentDidMount : function(){
					if(this.props.hasOwnProperty('ready') && 'function' === typeof this.props.ready){
						this.props.ready.call(this.props.ready);
					}
					this.props.router._init.call(this);
				},
				componentWillMount : function(){
					Store.Cart.addLoadedListener(
						function(){
							ifcEvents.emit('ifcAppCkout.cart.loaded');
						}
					);
				},
				componentWillReceiveProps: function (props) {
					
				},
				render: function () {
					return <div {...this.state}>
						<Component.Widget.Cart.Container {...Props.call(this).Cart} />
						<Component.Widget.Auth.Container {...Props.call(this).Auth} />
						<Component.Widget.Payment.Container {...Props.call(this).Payment} />
						<Component.Widget.Confirmation.Container {...Props.call(this).Confirmation} />

						<Component.Widget.Step {...{
							alias : 'error'
						}}>
							<blockquote className="quote">
								<h4 className="title">
									<span className="fragment">Ops</span>
								</h4>
								<ul className="collection unordered">
									<li className="item coupondu_used_in_this_login" data-error-key="coupondu.used.in.this.login">O cupom de desconto {0} já foi utilizado.{1}.</li>
									<li className="item cart_cep_invalid" data-error-key="cart.cep.invalid">CEP não encontrado.</li>
								</ul>
								<nav className="navigation menu alias-action">
									<p className="paragraph title">Opções:</p>
									<ul className="collection unordered">
										<li className="item alias-close">
											<a title="Fechar" href="#" className="anchor">
												<span className="fragment">Fechar</span>
											</a>
										</li>
									</ul>
								</nav>
							</blockquote>
						</Component.Widget.Step>
					</div>;
				}
			}
		);
	}
);