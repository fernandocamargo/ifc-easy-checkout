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
						Constant.Payment.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Payment.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Payment.ActionTypes.CHANGE
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
					
					/* -- Payment Options Object is return when: */
					case Constant.Payment.ActionTypes.CUSTOMER_AGREE:
					
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