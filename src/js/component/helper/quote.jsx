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
				displayName: 'Helper.Quote',
				mixins: [
					Behavior.Base
				],
				propTypes: {
					alias: React.PropTypes.string,
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					)
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
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						className:  {
							quote: true
						}
					};
				},
				render: function () {
					return <blockquote {...this.state}>
						{this.props.children}
					</blockquote>;
				}
			}
		);
	}
);