/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			};

		return React.createClass(
			{
				displayName: 'Helper.Table.Footer',
				mixins: [
					Behavior.Base
				],
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					)
				},
				getInitialState: function () {
					return {
						className:  {
							footer: true
						}
					};
				},
				render: function () {
					return <tfooter {...this.state}>
						{this.props.children}
					</tfooter>;
				}
			}
		);
	}
);