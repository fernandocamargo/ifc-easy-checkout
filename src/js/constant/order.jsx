/* global define */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var keyMirror = require('keymirror');

		return {
			ActionTypes: keyMirror(
				{
					CHANGE: null,
					
					ORDER_GET : null,
					ORDER_CREATE_CARD : null,
					ORDER_CREATE_PAYPAL : null,
					ORDER_CREATE_BILL : null
				}
			)
		};
	}
);