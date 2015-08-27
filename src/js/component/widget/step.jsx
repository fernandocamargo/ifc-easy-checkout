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
					Text: {
						Inline: require('jsx!component/helper/text/inline'),
						Title: {
							Second: require('jsx!component/helper/text/title/second')
						}
					}
				},
				Widget: {
					Section: require('jsx!component/helper/section')
				}
			},
			Props = function () {
				return {
					Title: {
						text: (this.props.label || '')
					}
				};
			};

		return React.createClass(
			{
				displayName: 'Widget.Step',
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
					label: React.PropTypes.string,
					serialize: React.PropTypes.object
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
								'alias'
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						className: {
							step: true
						}
					};
				},
				render: function () {
					return <Component.Widget.Section {...this.state}>
						{this.renders.title.call(this)}
						{this.props.children}
					</Component.Widget.Section>;
				},
				renders: {
					title: function () {
						return (!Props.call(this).Title.text ? !!Props.call(this).Title.text : <Component.Helper.Text.Title.Second>
							<Component.Helper.Text.Inline {...Props.call(this).Title} />
						</Component.Helper.Text.Title.Second>);
					}
				}
			}
		);
	}
);