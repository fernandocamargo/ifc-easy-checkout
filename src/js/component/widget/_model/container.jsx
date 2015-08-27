/* global define, ifcEvents, _, Mustache */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			},
			Util = {
				Checkout: require('jsx!util/checkout')
			},
			Store = {
				Cart: require('jsx!store/cart')
			},
			debug = require('custom/debug'),
			LocalStorage = {
				app : require('custom/local-storage'),
				custom : {
				}
			},
			Component = {
				Widget: {
					Step: require('jsx!component/widget/step'),
					Auth: {
						Login : require('jsx!component/widget/auth/login'),
						Register : require('jsx!component/widget/auth/register')
					}
				},
				Helper: {
					Text: {
						Block: require('jsx!component/helper/text/block'),
						Inline: require('jsx!component/helper/text/inline'),
						Legend: require('jsx!component/helper/text/legend')
					},
					Fieldset: require('jsx!component/helper/fieldset')
				}
			},
			
			Props = function () {
				return {}
			};

		return React.createClass(
			{
				displayName: 'Widget.Model',
				propTypes: {
					
				},
				mixins: [
					Behavior.Base
				],
				componentWillMount: function () {
					
					return this;
				},
				componentDidMount: function () {
					
					return this;
				},
				componentDidUpdate : function(prevProps, prevState){
					
					return this;
				},
				componentWillUnmount: function () {
					
					return this;
				},
				getDefaultProps: function () {
					return {
						serialize: {
							classname: [
							]
						}
					};
				},
				getInitialState: function () {
					return {
						alias: (this.props.alias || ''),
						label: (this.props.label || '')
					};
				},
				rewind: function () {
					return this;
				},
				forward: function () {
					return this;
				},
				render: function () {
					return this.renders['default'].call(
						this,
						Component.Widget.Step
					);
				},
				renders: {
					default: function (Wrapper) {
						return <Wrapper {...this.state}>
							<div className="content">
								
							</div>
						</Wrapper>;
					}
				}
			}
		);
	}
);