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
					PAYMENT_PAYPAL_CHANGE : null,

					PAYMENT_GET : null,
					PAYMENT_SET : null,
					PAYMENT_PAYPAL_SET : null,
					PAYMENT_PAYPAL_GET_URL : null
				}
			)
		};
	}
);