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
				displayName: 'Helper.Table',
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
							table: true
						}
					};
				},
				render: function () {
					return <table {...this.state}>
						{this.props.children}
					</table>;
				}
			}
		);
	}
);