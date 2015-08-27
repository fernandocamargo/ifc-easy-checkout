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
					
					GUEST_REGISTER : null,
					GUEST_CONVERT : null
				}
			)
		};
	}
);