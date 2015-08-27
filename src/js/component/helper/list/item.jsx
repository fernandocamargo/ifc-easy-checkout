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
				displayName: 'Helper.List.Item',
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
							className:  {
								item: true
							}
						};
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'alias'
							]
						}
					};
				},
				render: function () {
					return <li {...this.state}>
						{this.props.text || this.props.children}
					</li>;
				}
			}
		);
	}
);