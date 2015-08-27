/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react'),
			Behavior = {
				Base: require('jsx!behavior/base')
			};

		return React.createClass(
			{
				displayName: 'Helper.Text.Block',
				mixins: [
					Behavior.Base
				],
				propTypes: {
					className: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string,
							React.PropTypes.array
						]
					),
					text: React.PropTypes.oneOfType(
						[
							React.PropTypes.object,
							React.PropTypes.string
						]
					)
				},
				componentWillReceiveProps: function (props) {
					arguments.temp = {};

					if(props.hasOwnProperty('text')){
						arguments.temp.text = props.text;
					}
					if(props.hasOwnProperty('children')){
						arguments.temp.children = props.children;
					}

					if(_.size(arguments.temp)){
						this.set.state.call(
							this,
							arguments.temp
						);
					}

					return arguments.temp;

				},
				getInitialState: function () {
					return {
						className: {
							paragraph: true
						},
						text: this.props.text,
						children: this.props.children
					};
				},
				render: function () {
					return <p {...this.state}>
						{this.state.text || this.state.children}
					</p>;
				}
			}
		);
	}
);