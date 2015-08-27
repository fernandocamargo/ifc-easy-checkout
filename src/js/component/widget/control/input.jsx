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
					Control: {
						Input: require('jsx!component/helper/control/input')
					}
				}
			},
			Props = function () {
				return this.props;
			};

		return React.createClass(
			{
				displayName: 'Widget.Control.Input',
				mixins: [
					Behavior.Base
				],
				propTypes: Component.Helper.Control.Input.propTypes,
				getInitialState: function () {
					return Props.call(this);
				},
				componentWillReceiveProps: function (props) {
					this.set.state.call(
						this,
						props
					);
					return this;
				},
				render: function () {
					return <Component.Helper.Control.Input {...this.state} ref="input" />;
				}
			}
		);
	}
);