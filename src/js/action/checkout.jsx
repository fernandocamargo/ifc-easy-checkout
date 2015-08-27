/* global define */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var Dispatcher = {
				App: require('jsx!dispatcher/app')
			},
			Constant = {
				Cart: require('jsx!constant/cart'),
				Gift: require('jsx!constant/gift'),
				Discount: require('jsx!constant/discount'),
				Customer: require('jsx!constant/customer'),
				Guest: require('jsx!constant/guest'),
				Address: require('jsx!constant/address'),
				Shipping: require('jsx!constant/shipping'),
				Payment: require('jsx!constant/payment'),
				Order: require('jsx!constant/order')
			};

		return {
			Cart : {
				receive: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Cart.ActionTypes.RECEIVE,
							data: data
						}
					);
				},
				remove: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Cart.ActionTypes.REMOVE,
							data: data
						}
					);
				},
				removeAll: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Cart.ActionTypes.REMOVEALL,
							data: data
						}
					);
				},
				update: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Cart.ActionTypes.UPDATE,
							data: data
						}
					);
				}
			},
			Gift : {
				set: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Gift.ActionTypes.GIFT,
							data: data
						}
					);
				}
			},
			Discount: {
				set: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Discount.ActionTypes.DISCOUNT_SET,
							data: data
						}
					);
				},
				get: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Discount.ActionTypes.DISCOUNT_GET,
							data: data
						}
					);
				},
				remove: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Discount.ActionTypes.DISCOUNT_REMOVE,
							data: data
						}
					);
				},
				revoke: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Discount.ActionTypes.DISCOUNT_REVOKE,
							data: data
						}
					);
				}
			},
			Shipping: {
				get: function (data) {
					return Dispatcher.App.dispatch(
						{
							type: Constant.Shipping.ActionTypes.SHIPPING_GET,
							data: data
						}
					);
				},
				set: { 
					method : function (data) {
						return Dispatcher.App.dispatch(
							{
								type: Constant.Shipping.ActionTypes.SHIPPING_SET_METHOD,
								data: data
							}
						);
					},
					shop : function (data) {
						return Dispatcher.App.dispatch(
							{
								type: Constant.Shipping.ActionTypes.SHIPPING_SET_SHOP,
								data: data
							}
						);
					}
				}
			},
			Customer : {
				login : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_LOGIN,
							data: data
						}
					);
				},
				logout : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_LOGOUT,
							data: data
						}
					);
				},
				cleanup : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_CLEANUP,
							data: data
						}
					);
				},
				exist : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_EXIST,
							data: data
						}
					);
				},
				register : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_REGISTER,
							data: data
						}
					);
				},
				registerAndFreight : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_REGISTER_AND_FREIGHT,
							data: data
						}
					);
				},
				pass : {
					change : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Customer.ActionTypes.CUSTOMER_PASS_CHANGE,
								data: data
							}
						);
					},
					send : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Customer.ActionTypes.CUSTOMER_PASS_SEND,
								data: data
							}
						);
					}
				},
				agree : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Customer.ActionTypes.CUSTOMER_AGREE,
							data: data
						}
					);
				}
			},
			Guest : {
				register : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Guest.ActionTypes.GUEST_REGISTER,
							data: data
						}
					);
				},
				convert : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Guest.ActionTypes.GUEST_CONVERT,
							data: data
						}
					);
				},
			},
			Address : {
				find : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Address.ActionTypes.ADDRESS_FIND,
							data: data
						}
					);
				},
				insert : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Address.ActionTypes.ADDRESS_INSERT,
							data: data
						}
					);
				},
				remove : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Address.ActionTypes.ADDRESS_REMOVE,
							data: data
						}
					);
				},
				update : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Address.ActionTypes.ADDRESS_UPDATE,
							data: data
						}
					);
				},
				select : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Address.ActionTypes.ADDRESS_SELECT,
							data: data
						}
					);
				},
				slots : {
					get : {
						availables : function(data){
							return Dispatcher.App.dispatch(
								{
									type: Constant.Address.ActionTypes.ADDRESS_SLOTS,
									data: data
								}
							);
						},
						first : function(data){
							return Dispatcher.App.dispatch(
								{
									type: Constant.Address.ActionTypes.ADDRESS_SLOTS_FIRST,
									data: data
								}
							);
						}
					},
					reserve : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Address.ActionTypes.ADDRESS_SLOTS_RESERVE,
								data: data
							}
						);
					},
					validate : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Address.ActionTypes.ADDRESS_SLOTS_VALIDATE,
								data: data
							}
						);
					},
					release : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Address.ActionTypes.ADDRESS_SLOTS_RELEASE,
								data: data
							}
						);
					}
				}
			},
			Payment : {
				get : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Payment.ActionTypes.PAYMENT_GET,
							data: data
						}
					);
				},
				set : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Payment.ActionTypes.PAYMENT_SET,
							data: data
						}
					);
				},
				paypal : {
					set : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Payment.ActionTypes.PAYMENT_PAYPAL_SET,
								data: data
							}
						);
					},
					get_url : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Payment.ActionTypes.PAYMENT_PAYPAL_GET_URL,
								data: data
							}
						);
					}
				},
			},
			Order : {
				get : function(data){
					return Dispatcher.App.dispatch(
						{
							type: Constant.Order.ActionTypes.ORDER_GET,
							data: data
						}
					);
				},
				create : {
					card : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Order.ActionTypes.ORDER_CREATE_CARD,
								data: data
							}
						);
					},
					bill : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Order.ActionTypes.ORDER_CREATE_BILL,
								data: data
							}
						);
					},
					paypal : function(data){
						return Dispatcher.App.dispatch(
							{
								type: Constant.Order.ActionTypes.ORDER_CREATE_PAYPAL,
								data: data
							}
						);
					}
				}
			}
		};
	}
);