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
					Navigation: require('jsx!component/helper/navigation'),
					Text: {
						Block: require('jsx!component/helper/text/block')
					}
				},
				Widget: {
					Menu: {
						Items: require('jsx!component/widget/menu/items')
					}
				}
			},
			Props = function () {
				return {
					Container: {
						ref: 'items',
						items: _.reduce(
							(this.props.items || {}),
							function (stack, item, alias) {
								stack.push(
									_.merge(
										{},
										item,
										{
											alias: alias
										}
									)
								);
								return stack;
							},
							[]
						)
					},
					Title: {
						text: (this.props.label || ''),
						className: {
							title: true
						}
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Menu.Container',
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
					disabled: React.PropTypes.bool,
					items: React.PropTypes.object.isRequired,
					target: React.PropTypes.string,
					label: React.PropTypes.string,
					busy: React.PropTypes.bool,
					serialize: React.PropTypes.object
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'alias',
								'disabled',
								'busy'
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						className: {
							menu: true
						},
						disabled: (this.props.disabled || false),
						busy: !!this.props.busy
					};
				},
				componentWillReceiveProps: function (props) {
					this.set.state.call(
						this,
						{
							disabled: (props.disabled || false),
							busy: !!props.busy
						}
					);
					return this;
				},
				render: function () {
					return <Component.Helper.Navigation {...this.state}>
						{this.renders.title.call(this)}
						<Component.Widget.Menu.Items {...Props.call(this).Container} />
					</Component.Helper.Navigation>;
				},
				renders: {
					title: function () {
						return (!Props.call(this).Title.text ? Props.call(this).Title.text : <Component.Helper.Text.Block {...Props.call(this).Title} />);
					}
				}
			}
		);
	}
);