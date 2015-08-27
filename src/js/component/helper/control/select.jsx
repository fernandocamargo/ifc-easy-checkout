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
			debug = require('custom/debug'),
			Props = function () {
				return {
				}
			};

		return React.createClass(
			{
				displayName: 'Helper.Control.Select',
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					options: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					disabled: React.PropTypes.bool,
					id: React.PropTypes.string,
					busy: React.PropTypes.bool,
					name: React.PropTypes.string.isRequired,
					onBlur: React.PropTypes.func,
					onClick: React.PropTypes.func,
					onFocus: React.PropTypes.func,
					onChange: React.PropTypes.func,
					readOnly: React.PropTypes.bool,
					serialize: React.PropTypes.object,
					type: React.PropTypes.string.isRequired,
					value: React.PropTypes.string,
					autoComplete: React.PropTypes.string
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
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};

					if(props.hasOwnProperty('readOnly')){
						arguments.temp.readOnly = props.readOnly;
					}
					if(props.hasOwnProperty('disabled')){
						arguments.temp.disabled = props.disabled;
					}
					if(props.hasOwnProperty('defaultValue')){
						arguments.temp.defaultValue = props.defaultValue;
					}
					if(props.hasOwnProperty('options')){
						arguments.temp.options = props.options;
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
					arguments.temp = {
						className:  {
							select: true
						},
						title :  (this.props.title || false),
						options: (this.props.options || []),
						disabled: (this.props.disabled || false),
						defaultValue: (this.props.defaultValue || ''),
						id: (this.props.id || ''),
						busy: (this.props.busy || false),						
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
						readOnly: (this.props.readOnly || false),
						ref: this.props.ref,
						type: (this.props.type || 'select')
					};
					if(!!this.props.autoComplete){
						arguments.temp.autoComplete = this.props.autoComplete;
					}
					return arguments.temp;
				},
				componentDidMount : function(){
					arguments.temp = {
						DOM: React.findDOMNode(
							this
						)
					};

					
					delete arguments.temp;
					return this;
				},
				render: function () {
					return <select {..._.merge(
							this.state,
							{
								children : this.renders.options.call(this,this.state.options)
							}
						)} />;
				},
				renders : {
					options : function(itens){
						return (_.isArray(itens) ? itens.map(
								this.renders.option.bind(
									this,
									itens
								)
							) : _.isString(itens) ? 
								this.renders.option.call(
									this,
									itens
								)
								: _.isObject(itens) ? 
									( itens.hasOwnProperty('titles') && itens.hasOwnProperty('values') ) ?
										( _.size(itens.titles) === _.size(itens.values) ) ? 
											_.reduce(
												itens.values,
												function (stack, value, index){
													stack.push(
														this.renders.option.call(
															this,
															value,
															itens.titles[index]
														)
													);
													return stack;
												}.bind(
													this
												),
												[]
											)
										: 	(function(){
												debug.warn(this.name(), 'Select recebido com Keys e Values, porém não possuem mesma quantidade de itens em seus valores para unificação');
												return '';
											})()
									: _.keys(itens).map(
										this.renders.option.bind(
											this,
											itens
										)
									)
							: '')
					},
					option : function (value, title) {
						return <option {...{
							value : value,
						}}>
							{(title || value)}
						</option>
						;
					}
				},
				setValue: function(value){
					arguments.temp = {
						DOM: React.findDOMNode(
							this
						)
					};
					arguments.temp.DOM.value = value;

					return arguments.temp.DOM;
				},
			}
		);
	}
);