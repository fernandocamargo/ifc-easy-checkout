/* global define, _ */
/** @jsx React.DOM */
define(
	function (require) {
		'use strict';
		var React = require('react');

		return {
			toZip : function (value) {
				value = value.toString();
				return "00000000".substring(0, 8 - value.length) + value;
			},
			/**
			 * @param  String value Espera receber valor como: (23) 4234-23423"
			 * @return Array       	Retorna uma array dos valores de prefix e sufix
			 */
			separatePrefixTel: function(value){
				value = value.toString().replace(/\D/g,'');
				return [value.slice(0,2),value.slice(2,value.length)];
			},
			/**
			 * @param  String value Espera receber valor como: 89.227-300"
			 * @return Array       	Retorna uma array dos valores de prefix e sufix
			 */
			separatePrefixZip: function(value){
				value = value.toString().replace(/\D/g,'');
				return [value.slice(0,5),value.slice(5,value.length)];
			}
		};
	}
);