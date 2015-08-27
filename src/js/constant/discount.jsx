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
					
					DISCOUNT_SET: null,
					DISCOUNT_GET: null,
					DISCOUNT_REMOVE: null,
					DISCOUNT_REVOKE: null
				}
			)
		};
	}
);