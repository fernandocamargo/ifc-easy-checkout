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
						Select: require('jsx!component/helper/control/select')
					}
				}
			},
			Props = function () {
				return this.props;
			};

		return React.createClass(
			{
				displayName: 'Widget.Control.Select',
				mixins: [
					Behavior.Base
				],
				propTypes: Component.Helper.Control.Select.propTypes,
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
					return <Component.Helper.Control.Select {...this.state} ref="select" />;
				}
			}
		);
	}
);