/* global define, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Component = {
				Helper: {
					Quote: require('jsx!component/helper/quote'),
					Definition: {
						Container: require('jsx!component/helper/definition/container'),
						Description: require('jsx!component/helper/definition/description'),
						Title: require('jsx!component/helper/definition/title')
					},
					Text: {
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Label: require('jsx!component/helper/text/label')
					}
				},
				Widget: {
					Menu: {
						Container: require('jsx!component/widget/menu/container')
					},
					Control: {
						Input: require('jsx!component/widget/control/input'),
						Select: require('jsx!component/widget/control/select'),
						Textarea: require('jsx!component/widget/control/textarea')
					}
				}
			},
			Template = {
				id: Mustache.compile(
					'{{name}}[{{id}}]'
				),
				index: Mustache.compile(
					'{{id}}[{{index}}]'
				)
			},
			Props = function () {
				return {
					Resources: {
						complement: function () {
							return (!!this.props.complement ? (
									!_.isFunction(this.props.complement) ? this.props.complement : this.props.complement.call(
										this
									)
								) : false)
							;
						}
					},
					Control: {
						change: this.props.change,
						className: {
							control: true
						}
					},
					Menu: {
						Control: {
							alias: 'action',
							items: {
								increase: {
									label: 'Aumentar quantidade',
									href: this.increase,
									disabled : this.props.disabled
								},
								decrease: {
									label: 'Diminuir quantidade',
									href: this.decrease,
									disabled : this.props.disabled
								}
							},
							label: 'Opções:'
						}
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Control',
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
					label: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					busy: React.PropTypes.bool,
					name: React.PropTypes.string.isRequired,
					readOnly: React.PropTypes.bool,
					render: React.PropTypes.object.isRequired,
					serialize: React.PropTypes.object,
					type: React.PropTypes.string.isRequired,
					value: React.PropTypes.oneOfType(
						[
							React.PropTypes.string,
							React.PropTypes.number
						]
					),
					autocomplete: React.PropTypes.string,
					mask: React.PropTypes.object
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					if (_.isFunction(this.props.attach)) {
						this.props.attach(
							this
						);
					}
					return this;
				},
				componentWillUnmount: function () {
					if (_.isFunction(this.props.detach)) {
						this.props.detach(
							this
						);
					}
					return this;
				},
				getDefaultProps: function () {
					return {
						render: {
							container: {
								quote: [
									'checkbox',
									'radio'
								],
								block: [
									'submit',
									'hidden'
								],
								definition: [
									'tel',
									'number',
									'text',
									'select',
									'textarea',
									'password',
									'email'
								]
							},
							control: {
								input: [
									'tel',
									'checkbox',
									'number',
									'radio',
									'submit',
									'text',
									'password',
									'email',
									'hidden'
								],
								select: [
									'select'
								],
								textarea: [
									'textarea'
								]
							},
							complement: {
								number: [
									'number'
								]
							}
						},
						serialize: {
							classname: [
								'disabled',
								'busy',
								'name',
								'readOnly',
								'type'
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};

					if(props.hasOwnProperty('defaultChecked')){
						arguments.temp.defaultChecked = props.defaultChecked;
					}
					if(props.hasOwnProperty('disabled')){
						arguments.temp.disabled = props.disabled;
					}
					if(props.hasOwnProperty('options')){
						arguments.temp.options = props.options;
					}
					if(props.hasOwnProperty('busy')){
						arguments.temp.busy = props.busy;
					}
					if(props.hasOwnProperty('defaultValue')){
						arguments.temp.defaultValue = props.defaultValue;
					}
					if(!!props.autoComplete){
						arguments.temp.autoComplete = props.autoComplete;
					}
					
					this.set.state.call(
						this,
						arguments.temp
					);					
				},
				getInitialState: function () {
					arguments.temp = {
						blur: this.props.blur,
						change: this.props.change,
						click: this.props.click,
						complement: this.props.complement,
						focus: this.props.focus,
						keypress: this.props.keypress,
						keydown: this.props.keydown,
						keyup: this.props.keyup,
						paste: this.props.paste,
						className: {
							control: true
						},
						defaultValue: this.props.defaultValue,
						disabled: !!this.props.disabled,
						id: (this.props.id || Template.id(
							{
								name: (this.props.name || ''),
								id: this.id()
							}
						)),
						label: (this.props.label || ''),
						busy: !!this.props.busy,
						name: (this.props.name || ''),
						placeholder: (this.props.placeholder || ''),
						readOnly: (this.props.readOnly || false),
						ref: 'control',
						type: (this.props.type || 'text'),
						mask: (this.props.mask || {}),
						// value: (this.props.value || ''),
						defaultChecked : (this.props.defaultChecked || false),
						title : (this.props.title || false),
						//options : (this.props.options || []) // select options
					};
					if(!!this.props.options){
						arguments.temp.options = this.props.options;
					}
					if(!!this.props.autoComplete){
						arguments.temp.autoComplete = this.props.autoComplete;
					}
					if(!!this.props.defaultValue){
						arguments.temp.defaultValue = this.props.defaultValue;
					}
					if(!!this.props.value){
						arguments.temp.value = this.props.value;
					}
					return arguments.temp;
				},
				render: function () {
					return this.resolve(
						'container',
						this.resolve(
							'label'
						),
						this.resolve(
							'control'
						),
						this.resolve(
							'complement'
						)
					);
				},
				resolve: function (node) {
					arguments.temp = {
						render: ( Props.call(this).Resources.hasOwnProperty(node) ? Props.call(this).Resources[node].call(this) : false )
					};
					arguments.temp.render = (arguments.temp.render || this.props.render[node] || this.renders[node] || this.valueOf)

					var result = (React.isValidElement(arguments.temp.render) ? arguments.temp.render : (
						(_.isFunction(arguments.temp.render) ? arguments.temp.render : (this.renders[node][
								_.reduce(
									(arguments.temp.render || []),
									function (stack, range, type, rules) {
										return (_.includes(range, this.state.type) ? type : stack);
									}.bind(
										this
									),
									''
								)
							] || this.noop)).apply(
								this,
								Array.prototype.slice.call(
									arguments,
									true
								)
							)
						)
					);
					return result;
				},
				get: function () {
					return ( !( (_.isArray(this.state.options) || _.isPlainObject(this.state.options) ) ) ? [this.state] : _.reduce(
						this.state.options,
						function (stack, option, index) {
							return stack.concat(
								_.merge(
									{},
									this.state,
									option,
									{
										defaultIndexRef : index
									}
								)
							);
						}.bind(
							this
						),
						[]
					));
				},
				renders: {
					container: {
						block: function (label, control) {
							label = (_.isArray(label) ? _.first(label) : label);
							control = (_.isArray(control) ? _.first(control) : control);
							return <Component.Helper.Text.Block {...{
								className: this.state.className,
								ref : 'definition-block',
								children: control
							}} />;
						},
						quote: function (label, control, complement) {
							return <Component.Helper.Quote {...{
								className: this.state.className,
								ref: 'definition-quote',
								children: _.reduce(
									this.get.call(
										this
									),
									function (stack, option, index) {
										stack.push(
											<Component.Helper.Text.Block {..._.merge(
												{},
												Props.call(this).Control,
												{
													key: index
												}
											)}>
												{control[index]}
												{label[index]}
												<Component.Helper.Text.Inline {...{
													alias: 'complement-layout',
													ref: (index > 0 ? 'complement-layout'+index : 'complement-layout'),
												}} />
												{(!!option.complement ? option.complement : false)}
											</Component.Helper.Text.Block>
										);
										return stack;
									}.bind(
										this
									),
									[]
								)
							}} />;
						},
						definition: function (label, control, complement) {
							label = (_.isArray(label) ? _.first(label) : label);
							control = (_.isArray(control) ? _.first(control) : control);
							complement = (_.isArray(complement) ? _.first(complement) : complement);
							return <Component.Helper.Definition.Container {...{
								className: this.state.className,
								ref : 'definition-control'
							}}>
								{this.renders.title.definition.call(this, label)}
								<Component.Helper.Definition.Description>
									<Component.Helper.Text.Block {..._.merge(
										Props.call(this).Control,
										{
											children: control
										}
									)} />
									{complement}
								</Component.Helper.Definition.Description>
							</Component.Helper.Definition.Container>;
						}
					},
					title: {
						definition: function (label) {
							label = (_.isArray(label) ? _.first(label) : label);
							return (!label ? !!label : <Component.Helper.Definition.Title {...{
								text: label
							}} />);
						}
					},
					label: function () {
						return _.reduce(
							this.get.call(
								this
							),
							function (stack, item, index) {
								return stack.concat(
									(!item.label ? !!item.label : <Component.Helper.Text.Label {...{
										htmlFor: Template.index(
											{
												id: item.id,
												index: index
											}
										),
										ref: (index > 0 ? 'label'+index : 'label'),
										children: <Component.Helper.Text.Inline {...{
											text: item.label
										}} />
									}} />)
								);
							}.bind(
								this
							),
							[]
						);
					},
					control: {
						input: function () {
							return _.reduce(
								this.get.call(
									this
								),
								function (stack, item, index) {
									arguments.temp = (index > 0 ? { ref: this.state.ref+index } : {});
									return stack.concat(
										<Component.Widget.Control.Input {..._.merge(
											{},
											this.state,
											item,
											{
												id: Template.index(
													{
														id: this.state.id,
														index: index
													}
												)
											},
											arguments.temp
										)} />
									);
								}.bind(
									this
								),
								[]
							);
						},
						select: function () {
							return _.reduce(
								this.get.call(
									this
								),
								function (stack, item, index) {
									arguments.temp = (index > 0 ? { ref: this.state.ref+index } : {});
									return stack.concat(
										<Component.Widget.Control.Select {..._.merge(
											{},
											this.state,
											item,
											{
												id: Template.index(
													{
														id: this.state.id,
														index: index
													}
												)
											},
											arguments.temp
										)} />
									);
								}.bind(
									this
								),
								[]
							);
						},
						textarea: function () {
							return _.reduce(
								this.get.call(
									this
								),
								function (stack, item, index) {
									arguments.temp = (index > 0 ? { ref: this.state.ref+index } : {});
									return stack.concat(
										<Component.Widget.Control.Textarea {..._.merge(
											{},
											this.state,
											item,
											{
												id: Template.index(
													{
														id: this.state.id,
														index: index
													}
												)
											},
											arguments.temp
										)} />
									);
								}.bind(
									this
								),
								[]
							);
						}
					},
					complement: {
						number: function () {
							return _.reduce(
								this.get.call(
									this
								),
								function (stack, item, index) {
									return stack.concat(
										<Component.Widget.Menu.Container {...Props.call(this).Menu.Control} />
									);
								}.bind(
									this
								),
								[]
							);
						}
					}
				},
				busy : function(isBusy){
					this.set.state.call(this, {
						busy : isBusy
					});
				},
				sum: function (value) {
					if(!!this.props.disabled){
						return false;
					}
					arguments.temp = {
						DOM: React.findDOMNode(
							this.refs.control.refs.input
						)
					};
					arguments.temp.value = parseInt(
						arguments.temp.DOM.value,
						10
					);
					arguments.temp.DOM.value = Math.min(
						Math.max(
							1,
							(arguments.temp.value + value)
						),
						999
					);
					this.state.change.call(
						this,
						{
							target : arguments.temp.DOM
						}
					);
					delete arguments.temp;
					return this;
				},
				decrease: function (event) {
					if(!!this.props.disabled){
						return false;
					}
					this.sum.call(
						this,
						-1
					);
					return this;
				},
				increase: function (event) {
					if(!!this.props.disabled){
						return false;
					}
					this.sum.call(
						this,
						1
					);
					return this;
				}
			}
		);
	}
);