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
				displayName: 'Helper.Section',
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
							section: true
						}
					};
				},
				render: function () {
					return <section {...this.state}>
						{this.props.children}
					</section>;
				}
			}
		);
	}
);