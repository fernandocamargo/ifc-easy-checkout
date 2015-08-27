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
				displayName: 'Helper.Fieldset',
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
								'alias',
								'visible'
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};

					if(!!props.ref){
						arguments.temp.ref = props.ref;
					}
					if(!!props.className){
						arguments.temp.className = props.className;
					}
					if(!!props.visible){
						arguments.temp.visible = props.visible;
					}
					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
				},
				getInitialState: function () {
					arguments.temp = {
						alias: (this.props.alias || ''),
						className:  {
							fieldset: true
						},
						ref: 'fieldset'
					};
					if(!!this.props.ref){
						arguments.temp.ref = this.props.ref;
					}
					if(!!this.props.visible){
						arguments.temp.visible = this.props.visible;
					}
					return arguments.temp;
				},
				render: function () {
					return <fieldset {...this.state}>
						{this.props.children}
					</fieldset>;
				}
			}
		);
	}
);