/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react');

		return {
			receive: function (settings, XHR, status) {
				XHR = (XHR || {});
				XHR.responseJSON = (XHR.responseJSON || {});
				return _.reduce(
					[
						(status || ''),
						{
							response: {
								state: (XHR.readyState || ''),
								status: (XHR.status || ''),
								text: (XHR.statusText || '')
							},
							status: (XHR.responseJSON.status || false)
						},
						_.reduce(
							(XHR.responseJSON.messages || []),
							function (stack, message, code) {
								stack[message.detail] = message;
								return stack;
							}.bind(
								this
							),
							{}
						)
					],
					function (stack, value, index) {
						switch (true) {
						case _.isString(value):
							value = (value || index).toString();
							stack[value] = true;
							break;
						case _.isPlainObject(value):
							value = (value || {});
							stack = _.merge(
								stack,
								value
							);
							break;
						default:
							break;
						}
						return stack;
					}.bind(
						this
					),
					{}
				);
			}
		};
	}
);