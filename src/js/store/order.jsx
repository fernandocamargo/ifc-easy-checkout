/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';

		var Dispatcher = {
				App: require('jsx!dispatcher/app')
			},
			Constant = {
				Order: require('jsx!constant/order')
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
						Constant.Order.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Order.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					console.log('change emit store order')
					this.emit(
						Constant.Order.ActionTypes.CHANGE
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

					/* -- Order Object is returned when:  */
					case Constant.Order.ActionTypes.ORDER_GET:
					case Constant.Order.ActionTypes.ORDER_CREATE_CARD:
					case Constant.Order.ActionTypes.ORDER_CREATE_PAYPAL:
					case Constant.Order.ActionTypes.ORDER_CREATE_BILL:
					
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