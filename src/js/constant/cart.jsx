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
					RECEIVE: null,
					REMOVE: null,
					REMOVEALL: null,
					UPDATE: null
				}
			)
		};
	}
);