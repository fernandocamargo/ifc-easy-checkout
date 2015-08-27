/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				DOM: require('jsx!behavior/dom'),
				Validation: require('jsx!behavior/validation')
			},
			Component = {
				Helper: {
					Form: require('jsx!component/helper/form')
				},
				Widget: {
					Control: require('jsx!component/widget/control')
				}
			},
			Props = function () {
				return _.merge(
					{
						ref : 'widget-form'
					},
					this.props
				);
			};

		return React.createClass(
			{
				displayName: 'Widget.Form',
				mixins: [
					Behavior.Base,
					Behavior.DOM,
					Behavior.Validation
				],
				propTypes: Component.Helper.Form.propTypes,
				componentWillMount: function () {
					this.controls = {};
					this.data = {};
					return this;
				},
				render: function () {
					return <Component.Helper.Form {...Props.call(this)} action={this.action.call(
						this,
						this.props
					)}>
						{this.register.call(
							this
						)}
					</Component.Helper.Form>;
				},
				filter: function (component) {
					return React.addons.TestUtils.isElementOfType(
						component,
						Component.Widget.Control
					);
				},
				parse: function (node) {

					return React.Children.map(
						(!node ? node : node.props.children),
						function (component) {
							return (!component ? component : React.cloneElement(
								component,
								{
									attach: this.attach,
									children: this.parse.call(
										this,
										component
									),
									detach: this.detach
								}
							));
						}.bind(
							this
						)
					);
				},
				register: function () {
					return this.parse.call(
						this,
						this
					);
				},
				attach: function (component) {
					this.controls[component.props.name] = component;
					this.data[component.props.name] = component.state.value;
					return this;
				},
				detach: function (component) {
					delete this.controls[component.props.name];
					delete this.data[component.props.name];
					return this;
				},
				validate: function (event, settings) {
					settings = _.merge(
						{
							error : {}
						},
						settings
					);
					var hasErros = 0,
						resultValidation = _.reduce(
						this.serialize.call(
							this
						),
						function (stack, ref, name) {
							var _ref = (_.isArray(ref) ? _.first(ref) : ref),
								element = React.findDOMNode( _ref ),
								value;
							switch (true) {
							case _.isEqual(_ref.state.type, 'checkbox'):
								value = (element.checked ? element.value : '');
								break;
							case _.isEqual(_ref.state.type, 'radio'):
								value = _.reduce(
									ref,
									function (stack, _element) {
										arguments.temp = {
											DOM: React.findDOMNode(_element)
										};
										stack = (arguments.temp.DOM.checked ? arguments.temp.DOM.value : stack);
										return stack;
									}.bind(
										this
									),
									''
								);
								break;
							default:
								value = element.value;
								break;
							}
							arguments.temp = {
								props: (this.controls[name].props || {})
							};
							arguments.temp.rules = (arguments.temp.props.rules || {});
							arguments.temp.messages = (arguments.temp.props.messages || {});
							arguments.temp.errors = _.reduce(
								arguments.temp.rules,
								function (_stack, rule, alias) {
									arguments.temp = {
										valid: true
									};
									switch (true) {
									case this.root.is.hasOwnProperty(alias):
										arguments.temp.valid = this.root.is[alias][(!_.isArray(rule) ? 'call' : 'apply')](
											this.root,
											(!_.isArray(rule) ? value : [value].concat(
												rule
											))
										);
										break;
									case (_.isFunction(rule)):
										arguments.temp.valid = rule.call(
											this.root,
											value
										);
										break;
									default:
										break;
									}
									if (!arguments.temp.valid) {
										_stack[alias] = (this.temp.messages[alias] || '');
									}
									delete arguments.temp;
									return _stack;
								}.bind(
									{
										root: this,
										temp: arguments.temp
									}
								),
								{}
							);
							arguments.temp.errors_len = _.size(arguments.temp.errors);
							stack.refs[name] = _ref;
							stack.data[name] = value;
							if(arguments.temp.errors_len){
								stack.errors[name] = arguments.temp.errors;
							}
							hasErros = hasErros + ( !!arguments.temp.errors_len ? 1 : 0);
							return stack;
						}.bind(
							this
						),
						{
							refs: {},
							data: {},
							errors: {}
						}
					);
					
					resultValidation.hasErros = hasErros;
					
					return this[(!!hasErros ? 'error' : 'success')](resultValidation, settings);
				},
				serialize: function () {
					var result = _.reduce(
						_.keys(
							this.data
						),
						function (stack, name) {
							switch(this.controls[name].state.type){
								case 'tel':
								case 'text':
								case 'checkbox':
								case 'submit':
								case 'number':
								case 'email':
								case 'password':
								case 'hidden':
									stack[name] = this.controls[name].refs.control.refs.input;
									break;
								case 'select':
									stack[name] = this.controls[name].refs.control.refs.select;
									break;
								case 'textarea':
									stack[name] = this.controls[name].refs.control.refs.textarea;
									break;
								case 'radio':
									stack[name] = (stack[name] || []);
									if( _.isArray(this.controls[name].state.options)){
										for (var i = this.controls[name].state.options.length - 1; i >= 0; i--) {
											stack[name].push(
												this.controls[name].refs['control'+ ( i===0 ? '' : i ) ].refs.input
											);
										};
									}
									break;
							}
							return stack;
						}.bind(
							this
						),
						{}
					);
					return result;
				},
				success: function(resultValidation, settings){
					_.forEach(resultValidation.refs, function(ref){
						if(!!ref.state.error){
							if(ref.state.type !== 'submit' || !!ref.state.tooltip ){
								window.ifcAppCkout.layout.tooltips(
									React.findDOMNode(ref), 
									'',
									{
										forceHide : true
									}
								);
							}
							ref.set.state.call(ref, {
								error : false
							});
						}
					});
					return (!!settings.payback ? resultValidation.data : settings.handler.call(this, settings.handler, resultValidation.data) );
				},
				error: function (resultValidation, settings) {
					_.forEach(resultValidation.refs, function(ref, field){
						if(resultValidation.errors.hasOwnProperty(field)){
							if( settings.error.hasOwnProperty('individual') && _.isFunction(settings.error.individual) ){
								return settings.error.individual.call(this, field, resultValidation.errors[field]);
							}else{
								if(ref.state.type !== 'submit' || !!ref.state.tooltip ){
									window.ifcAppCkout.layout.tooltips(
										React.findDOMNode(ref), 
										resultValidation.errors[field],
										{
											forceShow : true,
											style : {
												classes : 'generic-error'
											}
										}
									);
								}
								return ref.set.state.call(ref, {
									error : true
								});
							}
						}else{
							if(ref.state.type !== 'submit' || !!ref.state.tooltip ){
								window.ifcAppCkout.layout.tooltips(
									React.findDOMNode(ref), 
									'',
									{
										forceHide : true
									}
								);
							}
							return ref.set.state.call(ref, {
								error : false
							});
						}
					});
					return false;
				},
				action: function (props) {
					return {
						context: this,
						handler: this.validate,
						params: [
							{
								handler: ( !!props.action  ? props.action : _ ),
								method: ( !!props.method ? props.method : 'post' ),
								error: ( !!props.error ? props.error :  {} )
							}
						]
					};
				}
			}
		);
	}
);