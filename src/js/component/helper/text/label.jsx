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
				displayName: 'Helper.Text.Label',
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
					),
					htmlFor: React.PropTypes.string,
					text: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string
						]
					)
				},
				getInitialState: function () {
					return {
						className: {
							label: true
						},
						htmlFor: (this.props.htmlFor || '')
					};
				},
				render: function () {
					return <label {...this.state}>
						{this.props.text || this.props.children}
					</label>;
				}
			}
		);
	}
);