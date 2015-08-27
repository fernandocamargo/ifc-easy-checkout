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
					
					CUSTOMER_LOGIN : null,
					CUSTOMER_EXIST : null,
					CUSTOMER_LOGOUT : null,
					CUSTOMER_CLEANUP : null,
					CUSTOMER_REGISTER : null,
					CUSTOMER_REGISTER_AND_FREIGHT : null,
					CUSTOMER_PASS_SEND : null,
					CUSTOMER_PASS_CHANGE : null,
					CUSTOMER_AGREE : null
				}
			)
		};
	}
);