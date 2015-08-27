/* global define */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var Custom = {
				Cart: require('custom/cart')
			},
			Action = {
				Checkout: require('jsx!action/checkout')
			};

		return {
			Cart : {
				get: function () {
					return Custom.Cart.get.call(
						Custom.Cart
					).done(
						Action.Checkout.Cart.receive.bind(
							Action.Checkout
						)
					);
				},
				remove: function (id) {
					return Custom.Cart.remove.call(
						Custom.Cart,
						id
					).done(
						Action.Checkout.Cart.remove.bind(
							Action.Checkout
						)
					);
				},
				removeAll: function (id) {
					return Custom.Cart.removeAll.call(
						Custom.Cart,
						id
					).done(
						Action.Checkout.Cart.removeAll.bind(
							Action.Checkout
						)
					);
				},
				update: function (id, quantity) {
					return Custom.Cart.update.call(
						Custom.Cart,
						id,
						quantity
					).done(
						Action.Checkout.Cart.update.bind(
							Action.Checkout
						)
					);
				}
			},
			Gift : {
				set: function (sclUUID, checked) {
					return Custom.Cart.gift.call(
						Custom.Cart,
						sclUUID,
						checked
					).done(
						Action.Checkout.Gift.set.bind(
							Action.Checkout
						)
					);
				}
			},
			Discount: {
				set: function (coupon) {
					return Custom.Cart.Discount.set.call(
						Custom.Cart,
						coupon
					).done(
						Action.Checkout.Discount.set.bind(
							Action.Checkout
						)
					);
				},
				get: function () {
					return Custom.Cart.Discount.get.call(
						Custom.Cart
					).done(
						Action.Checkout.Discount.get.bind(
							Action.Checkout
						)
					);
				},
				remove : function (coupon) {
					return Custom.Cart.Discount.remove.call(
						Custom.Cart,
						coupon
					).done(
						Action.Checkout.Discount.remove.bind(
							Action.Checkout
						)
					);
				},
				revoke : function (coupon) {
					return Custom.Cart.Discount.revoke.call(
						Custom.Cart,
						coupon
					).done(
						Action.Checkout.Discount.revoke.bind(
							Action.Checkout
						)
					);
				},
			},
			Shipping: {
				get: function (code) {
					return Custom.Cart.Shipping.get.call(
						Custom.Cart,
						code
					).done(
						Action.Checkout.Shipping.get.bind(
							Action.Checkout
						)
					);
				},
				set: {
					method : function (serviceCode, inShopDelivery) {
						return Custom.Cart.Shipping.set.method.call(
							Custom.Cart,
							serviceCode,
							inShopDelivery
						).done(
							Action.Checkout.Shipping.set.method.bind(
								Action.Checkout
							)
						);
					},
					shop :  function (shopId) {
						return Custom.Cart.Shipping.set.shop.call(
							Custom.Cart,
							shopId
						).done(
							Action.Checkout.Shipping.set.method.bind(
								Action.Checkout
							)
						);
					}
				}
			},
			Customer : {
				login : function(login, password){
					return Custom.Cart.Customer.login.call(
						Custom.Cart,
						login,
						password
					).done(
						Action.Checkout.Customer.login.bind(
							Action.Checkout
						)
					);
				},
				logout : function(){
					return Custom.Cart.Customer.logout.call(
						Custom.Cart
					).done(
						Action.Checkout.Customer.logout.bind(
							Action.Checkout
						)
					);
				},
				cleanup : function(){
					return Custom.Cart.Customer.cleanup.call(
						Custom.Cart
					).done(
						Action.Checkout.Customer.cleanup.bind(
							Action.Checkout
						)
					);
				},
				exist : function(emailOrDocumentNr){
					return Custom.Cart.Customer.exist.call(
						Custom.Cart,
						emailOrDocumentNr
					).done(
						Action.Checkout.Customer.exist.bind(
							Action.Checkout
						)
					);
				},
				register : function(objectCustomer){
					return Custom.Cart.Customer.register.call(
						Custom.Cart,
						objectCustomer
					).done(
						Action.Checkout.Customer.register.bind(
							Action.Checkout
						)
					);
				},
				registerAndFreight : function(objectCustomer){
					return Custom.Cart.Customer.registerAndFreight.call(
						Custom.Cart,
						objectCustomer
					).done(
						Action.Checkout.Customer.registerAndFreight.bind(
							Action.Checkout
						)
					);
				},
				pass : {
					change : function(newPassword, token){
						return Custom.Cart.Customer.pass.change.call(
							Custom.Cart,
							newPassword,
							token
						).done(
							Action.Checkout.Customer.pass.change.bind(
								Action.Checkout
							)
						);
					},
					send : function(emailOrDocumentNr){
						return Custom.Cart.Customer.pass.send.call(
							Custom.Cart,
							emailOrDocumentNr
						).done(
							Action.Checkout.Customer.pass.send.bind(
								Action.Checkout
							)
						);
					}
				},
				agree : function(agreeTerm){
					return Custom.Cart.Customer.agree.call(
						Custom.Cart,
						agreeTerm
					).done(
						Action.Checkout.Customer.agree.bind(
							Action.Checkout
						)
					);
				}
			},
			Guest : {
				register : function(objectGuest){
					return Custom.Cart.Guest.register.call(
						Custom.Cart,
						objectGuest
					).done(
						Action.Checkout.Guest.register.bind(
							Action.Checkout
						)
					);
				},
				convert : function(objectGuest){
					return Custom.Cart.Guest.convert.call(
						Custom.Cart,
						objectGuest
					).done(
						Action.Checkout.Guest.convert.bind(
							Action.Checkout
						)
					);
				},
			},
			Address : {
				find : function(postalCode){
					return Custom.Cart.Address.find.call(
						Custom.Cart,
						postalCode
					).done(
						Action.Checkout.Address.find.bind(
							Action.Checkout
						)
					);
				},
				insert : function(objectAddress){
					return Custom.Cart.Address.insert.call(
						Custom.Cart,
						objectAddress
					).done(
						Action.Checkout.Address.insert.bind(
							Action.Checkout
						)
					);
				},
				remove : function(addressId){
					return Custom.Cart.Address.remove.call(
						Custom.Cart,
						addressId
					).done(
						Action.Checkout.Address.remove.bind(
							Action.Checkout
						)
					);
				},
				update : function(objectAddress){
					return Custom.Cart.Address.update.call(
						Custom.Cart,
						objectAddress
					).done(
						Action.Checkout.Address.update.bind(
							Action.Checkout
						)
					);
				},
				select : function(addressId){
					return Custom.Cart.Address.select.call(
						Custom.Cart,
						addressId
					).done(
						Action.Checkout.Address.select.bind(
							Action.Checkout
						)
					);
				},
				slots : {
					get : {
						availables : function(){
							return Custom.Cart.Address.slots.get.availables.call(
								Custom.Cart
							).done(
								Action.Checkout.Address.slots.get.availables.bind(
									Action.Checkout
								)
							);
						},
						first : function(){
							return Custom.Cart.Address.slots.get.first.call(
								Custom.Cart
							).done(
								Action.Checkout.Address.slots.get.first.bind(
									Action.Checkout
								)
							);
						}
					},
					reserve : function(slotId){
						return Custom.Cart.Address.slots.reserve.call(
							Custom.Cart,
							slotId
						).done(
							Action.Checkout.Address.slots.reserve.bind(
								Action.Checkout
							)
						);
					},
					validate : function(){
						return Custom.Cart.Address.slots.validate.call(
							Custom.Cart
						).done(
							Action.Checkout.Address.slots.validate.bind(
								Action.Checkout
							)
						);
					},
					release : function(){
						return Custom.Cart.Address.slots.release.call(
							Custom.Cart
						).done(
							Action.Checkout.Address.slots.release.bind(
								Action.Checkout
							)
						);
					}
				}
			},
			Payment : {
				get : function(){
					return Custom.Cart.Payment.get.call(
						Custom.Cart
					).done(
						Action.Checkout.Payment.get.bind(
							Action.Checkout
						)
					);
				},
				set : function(paymentKey){
					return Custom.Cart.Payment.set.call(
						Custom.Cart,
						paymentKey
					).done(
						Action.Checkout.Payment.set.bind(
							Action.Checkout
						)
					);
				},
				paypal : {
					set : function(){
						return Custom.Cart.Payment.paypal.set.call(
							Custom.Cart
						).done(
							Action.Checkout.Payment.paypal.set.bind(
								Action.Checkout
							)
						);
					},
					get_url : function(){
						return Custom.Cart.Payment.paypal.get_url.call(
							Custom.Cart
						).done(
							Action.Checkout.Payment.paypal.get_url.bind(
								Action.Checkout
							)
						);
					}
				}
			},
			Order : {
				get : function(){
					return Custom.Cart.Order.get.call(
						Custom.Cart
					).done(
						Action.Checkout.Order.get.bind(
							Action.Checkout
						)
					);
				},
				create : {
					card : function(objectCardOptions){
						return Custom.Cart.Order.create.card.call(
							Custom.Cart,
							objectCardOptions
						).done(
							Action.Checkout.Order.create.card.bind(
								Action.Checkout
							)
						);
					},
					bill : function(paymentKey){
						return Custom.Cart.Order.create.bill.call(
							Custom.Cart,
							paymentKey
						).done(
							Action.Checkout.Order.create.bill.bind(
								Action.Checkout
							)
						);
					},
					paypal : function(paypalHash){
						return Custom.Cart.Order.create.paypal.call(
							Custom.Cart,
							paypalHash
						).done(
							Action.Checkout.Order.create.paypal.bind(
								Action.Checkout
							)
						);
					}
				}
			}
		};
	}
);