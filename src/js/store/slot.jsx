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
						Constant.Address.ActionTypes.ADDRESS_SLOTS_CHANGE,
						callback
					);
					return this;
				},
				removeChangeListener: function (callback) {
					this.removeListener(
						Constant.Address.ActionTypes.ADDRESS_SLOTS_CHANGE,
						callback
					);
					return this;
				},
				change: function () {
					this.emit(
						Constant.Address.ActionTypes.ADDRESS_SLOTS_CHANGE
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
					
					/* -- Slot List Object is returned when:  */
					case Constant.Address.ActionTypes.ADDRESS_SLOTS_VALIDATE:
						
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