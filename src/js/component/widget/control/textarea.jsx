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
						Textarea: require('jsx!component/helper/control/textarea')
					}
				}
			},
			Props = function () {
				return this.props;
			};

		return React.createClass(
			{
				displayName: 'Widget.Control.Textarea',
				mixins: [
					Behavior.Base
				],
				propTypes: Component.Helper.Control.Textarea.propTypes,
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
					return <Component.Helper.Control.Textarea {...this.state} ref="textarea" />;
				}
			}
		);
	}
);