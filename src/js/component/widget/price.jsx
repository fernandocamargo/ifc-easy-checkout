/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Helper = {
				Text: {
					Inline: require('jsx!component/helper/text/inline')
				}
			},
			Props = function () {
				return {
					decimalLength : 2,
					Rules: [
						{
							alias: 'currency',
							/*match: function (settings) {
								return (new RegExp(
									settings.value
								));
							},*/
							pattern: function (char, index) {
								return _.isEqual(
									index,
									0
								);
							},
							value: 'R$ '
						},
						{
							alias: 'decimal',
							/*match: function (settings) {
								return (new RegExp(
									[
										'^\d+(\\',
										settings.value,
										'\d{1,2})?$'
									].join(
										''
									)
								));
							},*/
							pattern: function (char, index, value, props) {
								return _.isEqual(
									index,
									(value.length - props.decimalLength)
								);
							},
							value: ','
						},
						{
							alias: 'thousand',
							/*match: function (settings) {
								return (new RegExp(
									settings.value
								));
							},*/
							pattern: function (char, index, value, props) {
								arguments.temp = {
									pattern: ((value.length - index) - props.decimalLength)
								};
								return (index && arguments.temp.pattern && _.isEqual(
									(arguments.temp.pattern % 3),
									0
								));
							},
							value: '.'
						}
					],
					Fragments: {
						Currency: {
							className: {
								currency: true
							},
							text: 'R$'
						},
						Value: {
							Container: {
								className: {
									value: true
								}
							},
							Decimal: {
								className: {
									decimal: true
								},
								text: '00'
							},
							Integer: {
								className: {
									integer: true
								},
								text: (this.props.value || 0).toString()
							},
							Separator: {
								Decimal: {
									className: {
										decimal: true,
										separator: true
									},
									text: ','
								},
								Integer: {
									className: {
										integer: true,
										separator: true
									},
									text: '.'
								}
							}
						}
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Price',
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					value: React.PropTypes.number.isRequired,
					currency: React.PropTypes.string
				},
				mixins: [
					Behavior.Base
				],
				getInitialState: function () {
					return {
						className: {
							price: true
						},
						stringToZero : (this.props.stringToZero || 'Grátis'),
						useStringToZero : (this.props.useStringToZero || false),
						value : (this.props.value || 0)
					};
				},
				componentWillReceiveProps: function (props) {
					if(!!props && props.hasOwnProperty('value')){
						this.setState({
							value : props.value
						});
					}
				},
				formatValueText : function(){
					
					if(this.props.value === 0 && this.props.useStringToZero ) {
						return this.props.stringToZero;
					}
					arguments.temp = {
						value: 	(
									+this.props.value || 0
								)
								.toFixed(Props.call(this).decimalLength)
								.toString().replace('.','')
					};
					arguments.temp.value = _.reduce(
						_.merge(
							[],
							arguments.temp.value
						),
						function (stack, char, index, value) {
							arguments.temp = {
								patterns: _.reduce(
									Props.call(this).Rules,
									function (_stack, rule) {
										return (!rule.pattern.call(
											this,
											char,
											index,
											value.join(
												''
											),
											Props.call(this)
										) ? _stack : _stack.concat(
											rule.value
										));
									}.bind(
										this
									),
									[]
								)
							};
							return stack.concat(
								arguments.temp.patterns
							).concat(
								char
							);
						}.bind(
							this
						),
						[]
					).join(
						''
					);

					return arguments.temp.value;
				},
				render: function () {
					return <Helper.Text.Inline {...{
						text: this.formatValueText()
					}} />;
				}
			}
		);
	}
);