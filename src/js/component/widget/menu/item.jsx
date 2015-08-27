/* global define, _ */
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
					List: {
						Item: require('jsx!component/helper/list/item')
					},
					Text: {
						Anchor: require('jsx!component/helper/text/anchor')
					}
				}
			},
			Props = function () {
				return {
					Anchor: {
						href: this.props.href,
						text: (this.props.label || ''),
						target : (this.props.target || '_self'),
						disabled: this.props.disabled 
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Menu.Item',
				mixins: [
					Behavior.Base
				],
				propTypes: {
					alias: React.PropTypes.string.isRequired,
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					href: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array,
							React.PropTypes.func
						]
					),
					label: React.PropTypes.string.isRequired,
					serialize: React.PropTypes.object,
					disabled: React.PropTypes.bool
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'disabled',
								'alias'
							]
						}
					};
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};
					if(props.hasOwnProperty('disabled')){
						arguments.temp.disabled = props.disabled;
					}
					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}
					delete arguments.temp;
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						disabled: (this.props.disabled || false),
					};
				},
				render: function () {
					return <Component.Helper.List.Item {...this.state}>
						<Component.Helper.Text.Anchor {...Props.call(this).Anchor} />
					</Component.Helper.List.Item>;
				}
			}
		);
	}
);