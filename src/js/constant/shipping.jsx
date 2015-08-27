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
					
					SHIPPING_SET_METHOD: null,
					SHIPPING_SET_SHOP: null,
					SHIPPING_GET: null
				}
			)
		};
	}
);