/* global define, $, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				DOM: require('jsx!behavior/dom')
			},
			Props = function () {
				return {
					Mask: {
						showMaskOnHover: false,
						clearMaskOnLostFocus : true,
						autoUnmask: true
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Helper.Control.Textarea',
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					disabled: React.PropTypes.bool,
					id: React.PropTypes.string,
					busy: React.PropTypes.bool,
					maxlength: React.PropTypes.number,
					name: React.PropTypes.string.isRequired,
					onBlur: React.PropTypes.func,
					onClick: React.PropTypes.func,
					onFocus: React.PropTypes.func,
					onKeyPress: React.PropTypes.func,
					onKeyDown: React.PropTypes.func,
					onKeyUp: React.PropTypes.func,
					onChange: React.PropTypes.func,
					placeholder: React.PropTypes.string,
					readOnly: React.PropTypes.bool,
					serialize: React.PropTypes.object,
					type: React.PropTypes.string.isRequired,
					value: React.PropTypes.string,
					mask: React.PropTypes.object
				},
				mixins: [
					Behavior.Base,
					Behavior.DOM
				],

				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'disabled',
								'busy',
								'name',
								'readOnly',
								'type',
								'error'
							]
						},
						mask : {
							mask : false
						}
					};
				},
				componentWillReceiveProps: function (props) {
					this.set.state.call(
						this,
						{
							readOnly: (props.readOnly || false),
							disabled: (props.disabled || false),
							defaultValue: (props.defaultValue || '')
						}
					);
					return this;
				},
				getInitialState: function () {
					return {
						className:  {
							input: true
						},
						disabled: (this.props.disabled || false),
						defaultValue: (this.props.defaultValue || ''),
						id: (this.props.id || ''),
						busy: (this.props.busy || false),
						maxlength: this.props.maxlength,
						name: (this.props.name || ''),
						onBlur: this.events.delegate.call(
							this,
							this.props.blur,
							{
								prevent: false
							}
						),
						onChange: this.events.delegate.call(
							this,
							this.props.change,
							{
								prevent: false
							}
						),
						onClick: this.events.delegate.call(
							this,
							this.props.click,
							{
								prevent: false
							}
						),
						onFocus: this.events.delegate.call(
							this,
							this.props.focus,
							{
								prevent: false
							}
						),
						onKeyPress: this.events.delegate.call(
							this,
							this.props.keypress,
							{
								prevent: false
							}
						),
						onKeyDown: this.events.delegate.call(
							this,
							this.props.keydown,
							{
								prevent: false
							}
						),
						onKeyUp:this.events.delegate.call(
							this,
							this.props.keyup,
							{
								prevent: false
							}
						),
						placeholder: this.props.placeholder,
						readOnly: (this.props.readOnly || false),
						ref: this.props.ref,
						type: (this.props.type || 'text')
					};
				},
				componentDidMount : function(){
					arguments.temp = {
						DOM: React.findDOMNode(
							this
						)
					};

					if(!!$ && !!$.fn && !!$.fn.inputmask && !!this.props.mask){
						$(arguments.temp.DOM).inputmask(
							_.merge(
								Props.call(this).Mask,
								this.props.mask
							)
						);
					}
					delete arguments.temp;
					return this;
				},
				render: function () {
					return <textarea {...this.state} />;
				},
				setValue: function(value){
					arguments.temp = {
						DOM: React.findDOMNode(
							this
						)
					};
					arguments.temp.DOM.value = value;

					return arguments.temp.DOM;
				}
			}
		);
	}
);