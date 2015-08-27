/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react');

		return {
			events: {
				delegate: function (reference, settings) {
					return this.events.handler.bind(
						{
							root: this,
							reference: reference,
							settings: _.merge(
								{

								},
								(settings || {})
							)
						}
					);
				},
				handler: function (event) {
					return ((!this.reference || _.isString(this.reference)) ? event : (_.flowRight.apply(
						_,
						((!_.isUndefined(this.settings.prevent) && !this.settings.prevent) ? [] : [
							event.preventDefault.bind(
								event
							)
						]).concat(
							_.reduce(
								(!_.isArray(this.reference) ? [this.reference] : this.reference),
								function (stack, reference) {
									arguments.temp = {
										handler: (reference.handler || reference || false),
										context: (reference.context || this || false),
										params: (!reference.params ? !!reference.params : (_.isArray(reference.params) ? reference.params : [reference.params]))
									};
									stack = (!_.isFunction(arguments.temp.handler) ? stack : stack.concat(
										function () {
											return this.temp.handler.apply(
												this.temp.context,
												[
													event
												].concat(
													(!this.temp.params ? [] : _.map(
														this.temp.params,
														function (method) {
															return (!_.isFunction(method) ? method : method());
														},
														[]
													))
												)
											);
										}.bind(
											{
												temp: arguments.temp
											}
										)
									));
									delete arguments.temp;
									return stack;
								},
								[]
							)
						)
					).call(
						_
					)));
				}
			}
		};
	}
);