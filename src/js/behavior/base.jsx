/* global define, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Classnames = require('classnames'),
			Template = {
				serialize: {
					classname: Mustache.compile(
						'{{prop}}-{{value}}'
					)
				}
			};

		return {
			propTypes: {},
			getDefaultProps: function () {
				return {};
			},
			getInitialState: function () {
				return _.reduce(
					(this.props || {}),
					function (stack, value, key) {
						if (_.startsWith(key, 'data-') && !_.startsWith(key, 'data-react')) {
							stack[key] = value;
						}
						return stack;
					},
					{}
				);
			},
			getDOMClean : function(){
				return React.renderToStaticMarkup(this._reactInternalInstance._currentElement);				
			},
			findChildrenByClassName : function(component, className){
				// var itens = React.addons.TestUtils.findAllInRenderedTree(
				// 	component,
				// 	function(c){
				// 		return name === c.constructor.displayName;
				// 	}
				// );
				var itens = [];
				if(React.addons.TestUtils.isCompositeComponent(component)){
					itens = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, className);
				}
				return itens;
			},
			componentWillMount: function () {
				this.set.classname.call(
					this
				);
				return this;
			},
			componentWillReceiveProps: function (props) {
				this.set.classname.call(
					this,
					props
				);
				return this;
			},
			shouldComponentUpdate: function (props, state) {
				if(props.hasOwnProperty('children') || state.hasOwnProperty('children')){ // to prevent console warnings about access React Elements
					return true;
				}
				return !( _.isEqual(this.props, props) && _.isEqual(this.state, state) );
			},
			id: function () {
				return (this._rootNodeID || _.now()).toString(
				).toLowerCase(
				).replace(
					/[^0-9]+/g,
					''
				);
			},
			name: function () {
				return (this.constructor.displayName || '').toLowerCase();
			},
			noop: function () {
				return;
			},
			set: {
				state: function (state) {
					this.setState(
						state,
						function () {
							return this.set.classname.call(
								this
							);
						}.bind(
							this
						)
					);
					return this;
				},
				classname: function (props) {
					this.setState(
						{
							// _: true,
							className: this.classname.normalize.call(
								this,
								props
							)
						}
					);
					return this;
				}
			},
			classname: {
				filter: function (resource) {
					return _.reduce(
						(resource || []),
						function (stack, value, classname) {
							if (_.isBoolean(value)) {
								stack[classname] = value;
							}
							return stack;
						},
						{}
					);
				},
				parse: function (resource) {
					return [].concat(
						(_.isPlainObject(resource) ? _.keys(resource) : [])
					).concat(
						(_.isArray(resource) ? resource : [])
					).concat(
						(!_.isString(resource) ? [] : resource.toLowerCase(
						).replace(
							/\./g,
							'-'
						).split(
							' '
						))
					).concat(
						(_.isBoolean(resource) ? resource.toString() : [])
					);
				},
				normalize: function (state) {
					arguments.temp = {
						state: (state || this.state)
					};
					arguments.temp.defaults = (this.getInitialState().className || {});
					arguments.temp.classnames = [].concat(
						this.classname.parse(arguments.temp.defaults)
					).concat(
						this.classname.parse((state || this.props).className)
					).concat(
						_.reduce(
							_.filter(
								((this.props.serialize || {}).classname || []),
								function (prop) {
									return this.temp.state.hasOwnProperty(prop);
								}.bind(
									{
										root: this,
										temp: arguments.temp
									}
								)
							),
							function (stack, prop) {
								return stack.concat(
									_.reduce(
										[].concat(
											this.root.classname.parse(
												this.temp.state[prop]
											)
										),
										function (_stack, value) {
											return _stack.concat(
												(_.isUndefined(value) ? [] : Template.serialize.classname(
													{
														prop: prop.toString().toLowerCase(),
														value: value.toString().toLowerCase()
													}
												))
											);
										}.bind(
											this
										),
										[]
									)
								);
							}.bind(
								{
									root: this,
									temp: arguments.temp
								}
							),
							[]
						)
					);
					return Classnames(
						_.zipObject(
							arguments.temp.classnames,
							Array.apply(
								[],
								(new Array(arguments.temp.classnames.length))
							).map(
								Boolean.prototype.valueOf,
								true
							)
						)
					);
				}
			}
		};
	}
);