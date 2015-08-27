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
						Unordered: require('jsx!component/helper/list/unordered')
					}
				},
				Widget: {
					Menu: {
						Item: require('jsx!component/widget/menu/item')
					}
				}
			};

		return React.createClass(
			{
				displayName: 'Widget.Menu.Items',
				mixins: [
					Behavior.Base
				],
				propTypes: {
					items: React.PropTypes.array.isRequired
				},
				getInitialState: function () {
					return {
						items: (this.props.items || [])
					};
				},
				componentWillReceiveProps: function (props) {
					if(props.hasOwnProperty('items')){
						this.set.state.call(this, {
							items : props.items
						});
					}
				},
				render: function () {
					return <Component.Helper.List.Unordered>
						{this.state.items.map(this.renders.items.bind(this))}
					</Component.Helper.List.Unordered>;
				},
				renders: {
					items: function (item, index) {
						return <Component.Widget.Menu.Item {..._.merge(
							{},
							item,
							{
								key: index
							}
						)} />;
					}
				}
			}
		);
	}
);