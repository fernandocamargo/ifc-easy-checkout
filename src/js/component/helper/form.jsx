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
				displayName: 'Helper.Form',
				mixins: [
					Behavior.Base,
					Behavior.DOM
				],
				propTypes: {
					action: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array,
							React.PropTypes.func
						]
					),
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					disabled: React.PropTypes.bool,
					id: React.PropTypes.string,
					visible: React.PropTypes.bool,
					busy: React.PropTypes.bool,
					name: React.PropTypes.string,
					method: React.PropTypes.string,
					onSubmit: React.PropTypes.func,
					serialize: React.PropTypes.object
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'disabled',
								'name',
								'busy',
								'visible'
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};

					if(props.hasOwnProperty('busy')){
						arguments.temp.busy = props.busy;
					}
					if(props.hasOwnProperty('disabled')){
						arguments.temp.disabled = props.disabled;
					}
					if(props.hasOwnProperty('visible')){
						arguments.temp.visible = props.visible;
					}
					if(props.hasOwnProperty('className')){
						arguments.temp.className = props.className;
					}
					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
					return this;
				},
				getInitialState: function () {
					return {
						action: (_.isString(this.props.action) ? this.props.action : '#'),
						className: {
							form: true
						},
						id: (this.props.id || ''),
						disabled: (this.props.hasOwnProperty('disabled') ? this.props.disabled : false),
						busy: !!this.props.busy,
						visible: (this.props.hasOwnProperty('visible') ? this.props.visible : true),
						name: (this.props.name || ''),
						method: (this.props.method || ''),
						ref: 'form',
						onSubmit: this.events.delegate.call(
							this,
							this.props.action
						)
					};
				},
				render: function () {
					return <form {...this.state}>
						{this.props.children}
					</form>;
				}
			}
		);
	}
);