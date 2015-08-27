/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';

		var Dispatcher = {
				App: require('jsx!dispatcher/app')
			},
			Constant = {
				Address: require('jsx!constant/address')
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
						Constant.Address.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Address.ActionTypes.CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Address.ActionTypes.CHANGE
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
					
					/* -- Simple Address Object is returned when:  */
					case Constant.Cart.ActionTypes.ADDRESS_FIND:
						
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