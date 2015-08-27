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
				displayName: 'Helper.Text.Italic',
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
							fragment: true,
							italic: true
						}
					};
				},
				render: function () {
					return <em {...this.state}>
						{this.props.text || this.props.children}
					</em>;
				}
			}
		);
	}
);