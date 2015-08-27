/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';

		var Dispatcher = {
				App: require('jsx!dispatcher/app')
			},
			Constant = {
				Customer: require('jsx!constant/customer')
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
						Constant.Customer.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Customer.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Customer.ActionTypes.CHANGE
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
					
					/* -- Generic Data Object is returned when:  */
					case Constant.Customer.ActionTypes.CUSTOMER_EXIST:
						
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