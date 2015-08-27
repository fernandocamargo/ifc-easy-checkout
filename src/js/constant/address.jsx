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
					ADDRESS_SLOTS_CHANGE : null,
					ADDRESS_SLOTS_LIST_CHANGE : null,
					
					ADDRESS_FIND: null,
					ADDRESS_INSERT: null,
					ADDRESS_REMOVE: null,
					ADDRESS_UPDATE: null,
					ADDRESS_SELECT: null,

					ADDRESS_SLOTS : null,
					ADDRESS_SLOTS_FIRST : null,
					ADDRESS_SLOTS_RESERVE : null,
					ADDRESS_SLOTS_VALIDATE : null,
					ADDRESS_SLOTS_RELEASE : null
				}
			)
		};
	}
);