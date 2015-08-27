/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base'),
				DOM: require('jsx!behavior/dom')
			},
			Component = {
				Helper: {
					Text: {
						Inline: require('jsx!component/helper/text/inline')
					}
				}
			},
			Props = function () {
				return {
					Children: {
						text: this.props.text
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Helper.Text.Anchor',
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
					disabled: React.PropTypes.bool,
					href: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array,
							React.PropTypes.func
						]
					),
					busy: React.PropTypes.bool,
					onClick: React.PropTypes.func,
					serialize: React.PropTypes.object,
					text: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string
						]
					),
					target: React.PropTypes.string,
					title: React.PropTypes.string
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'disabled',
								'busy'
							]
						}
					};
				},
				getInitialState: function () {
					var result = {
						className:  {
							anchor: true
						},
						disabled: (this.props.disabled || false),
						href: (_.isString(this.props.href) ? this.props.href : '#'),
						busy: !!this.props.busy,
						onClick: this.events.delegate.call(
							this,
							this.props.href
						),
						title: (this.props.title || (_.isString(this.props.text) ? this.props.text : ''))
					};
					if(!!this.props.target){
						result.target = this.props.target;
					}
					return result;
				},
				render: function () {
					return <a {...this.state}>
						{this.renders.children.call(this)}
					</a>;
				},
				renders: {
					children: function () {
						return (_.isString(Props.call(this).Children.text) ? <Component.Helper.Text.Inline {...Props.call(this).Children} /> : this.props.children);
					}
				}
			}
		);
	}
);