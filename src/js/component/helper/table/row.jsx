/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Props = function () {
				return {
					className : ['row']
				}
			};


		return React.createClass(
			{
				displayName: 'Helper.Table.Row',
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
					),
					serialize: React.PropTypes.object
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
				componentWillReceiveProps: function (props) {
				
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						className: ( !!this.props.className ? 
							_.merge(
								(
									_.isArray(this.props.className) ? this.props.className : this.props.className.split(' ')
								),
								Props.call(this).className
							) : 
							Props.call(this).className
						)
					};
				},
				render: function () {
					return <tr {...this.state}>
						{this.props.children}
					</tr>;
				}
			}
		);
	}
);