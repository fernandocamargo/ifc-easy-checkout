/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';

		var Dispatcher = {
				App: require('jsx!dispatcher/app')
			},
			Constant = {
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
						Constant.Payment.ActionTypes.PAYMENT_PAYPAL_CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Payment.ActionTypes.PAYMENT_PAYPAL_CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Payment.ActionTypes.PAYMENT_PAYPAL_CHANGE
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
					
					/* -- Info PayPal Object is returned when:  */
					case Constant.Payment.ActionTypes.PAYMENT_PAYPAL_GET_URL:
						
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