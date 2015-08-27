/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				DOM: require('jsx!behavior/dom')
			};

		return React.createClass(
			{
				displayName: 'Helper.Definition.Container',
				mixins: [
					Behavior.Base,
					Behavior.DOM
				],
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					out: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array,
							React.PropTypes.func
						]
					),
					over: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array,
							React.PropTypes.func
						]
					),
					serialize: React.PropTypes.object
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'visible',
								'alias'
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						className:  {
							definition: true
						},
						onMouseOut: this.events.delegate.call(
							this,
							this.props.out
						),
						onMouseOver: this.events.delegate.call(
							this,
							this.props.over
						),
						visible: (!_.isUndefined(this.props.visible) ? this.props.visible : true),
					};
				},
				render: function () {
					return <dl {...this.state}>
						{this.props.children}
					</dl>;
				}
			}
		);
	}
);