/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react');

		return {
			is: {
				required: function (value) {
					return !!value;
				},
				size: function (value, min, max) {
					value = (value.hasOwnProperty('length') ? value : value.toString());
					min = parseInt((min || 1), 10);
					max = parseInt((max || min), 10);
					return (_.isEqual(Math.max(value.length, min), value.length) && _.isEqual(Math.min(value.length, max), value.length));
				},
				zip: function (value) {
					return ( /^\d{5}(?:[-\s]\d{3})?$/.test(value) || /^\d{8}/.test(value) );
				},
				mail : function(value){
					return true;
				},
				phone : function(value){
					return true;
				}
			}
		};
	}
);