/* global define, _ */
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
				Payment: require('jsx!constant/payment')
			},
			EventEmitter = require('events').EventEmitter,
			Store,
			Data;

		Store = _.assign(
			{},
			EventEmitter.prototype,
			{
				addChangeListener: function (callback) {
					this.on(
						Constant.Cart.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Cart.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				addLoadedListener: function (callback) {
					this.once(
						Constant.Cart.ActionTypes.RECEIVE,
						callback
					);
					return this;
				},
				loaded: function () {
					this.emit(
						Constant.Cart.ActionTypes.RECEIVE
					);
					return this;
				},
				reload: function () {
					this.emit(
						Constant.Cart.ActionTypes.CHANGE
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Cart.ActionTypes.CHANGE
					);
					return this;
				},
				set: function (data) {
					Data = data;
					return this;
				},
				get: function () {
					return Data;
				}
			}
		);

		Store.dispatchToken = Dispatcher.App.register(
			function (payload) {
				switch (payload.type) {

					
					/* -- Shopping Cart Object is returned when:  */
					case Constant.Cart.ActionTypes.RECEIVE:
						Store.set(
							payload.data
						).loaded(
						);
						break;

					case Constant.Cart.ActionTypes.UPDATE:
					case Constant.Cart.ActionTypes.REMOVE:
					case Constant.Cart.ActionTypes.REMOVEALL:
					
					case Constant.Discount.ActionTypes.DISCOUNT_SET:
					case Constant.Discount.ActionTypes.DISCOUNT_GET:
					case Constant.Discount.ActionTypes.DISCOUNT_REMOVE:
					case Constant.Discount.ActionTypes.DISCOUNT_REVOKE:

					case Constant.Shipping.ActionTypes.SHIPPING_GET:
					case Constant.Shipping.ActionTypes.SHIPPING_SET_METHOD:
					case Constant.Shipping.ActionTypes.SHIPPING_SET_SHOP:
					
					case Constant.Gift.ActionTypes.GIFT:

					case Constant.Customer.ActionTypes.CUSTOMER_LOGIN:
					case Constant.Customer.ActionTypes.CUSTOMER_LOGOUT:
					case Constant.Customer.ActionTypes.CUSTOMER_CLEANUP:
					case Constant.Customer.ActionTypes.CUSTOMER_REGISTER:
					case Constant.Customer.ActionTypes.CUSTOMER_REGISTER_AND_FREIGHT:
					case Constant.Customer.ActionTypes.CUSTOMER_REGISTER_AND_FREIGHT:
					case Constant.Customer.ActionTypes.CUSTOMER_PASS_SEND:
					case Constant.Customer.ActionTypes.CUSTOMER_PASS_CHANGE:

					case Constant.Guest.ActionTypes.GUEST_REGISTER:
					case Constant.Guest.ActionTypes.GUEST_CONVERT:

					case Constant.Address.ActionTypes.ADDRESS_INSERT:
					case Constant.Address.ActionTypes.ADDRESS_REMOVE:
					case Constant.Address.ActionTypes.ADDRESS_UPDATE:
					case Constant.Address.ActionTypes.ADDRESS_SELECT:
					case Constant.Address.ActionTypes.ADDRESS_SLOTS_RELEASE:

					case Constant.Payment.ActionTypes.PAYMENT_GET:
					case Constant.Payment.ActionTypes.PAYMENT_SET:
					case Constant.Payment.ActionTypes.PAYMENT_PAYPAL_SET:

						Store.set(
							payload.data
						).change(
						);
						break;
				}
			}
		);

		return Store;
	}
);