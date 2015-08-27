/* global define, _, $, Mustache */
/**
 * Docs: https://lab.accurate.com.br/twiki/bin/view/Main/AcecCkoutRestServices
 */
define(
	function () {
		'use strict';
		var _namespace = 'cart',
			_defaults = {},
			Behavior = {
				Error: require('jsx!behavior/error')
			},
			Constant = {
				Ajax: require('jsx!constant/ajax')
			},
			EventEmitter = require('events').EventEmitter,
			debug = require('custom/debug'),
			Template = {
				Ajax: {
					settings: {
						data: Mustache.compile(
							'jsonData={{{data}}}'
						)
					}
				},
				JSON: {
					object: Mustache.compile(
						'\{ {{{object}}} \}'
					)
				}
			},
			Props = function () {
				return {
					Ajax: {
						settings: {
							type: 'POST',
							dataType: 'json',
							headers: {
								Accept: 'application/json; charset=utf-8',
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							}
						}
					}
				};
			};

		return {
			init: function (parent, settings) {
				this.namespace = _namespace;
				this.parent = (parent || this);
				this.settings = _.merge(
					{},
					_defaults,
					settings
				);
				this.build.call(this);
				return this;
			},
			build: function () {
				return this;
			},
			request: function (settings) {
				arguments.temp = {
					listener: (new EventEmitter())
				};
				arguments.temp.settings = _.merge(
					Props.call(this).Ajax.settings,
					(settings || {}),
					(!settings.data ? {} : {
						data: Template.Ajax.settings.data(
							{
								data: JSON.stringify(
									settings.data
								)
							}
						)
					})
				);
				arguments.temp.settings.complete = function () {
					return this.temp.listener.emit.apply(
						this.temp.listener,
						[
							Constant.Ajax.ActionTypes.DONE
						].concat(
							this.temp.settings
						).concat(
							Array.prototype.slice.call(
								arguments
							)
						)
					);
				}.bind(
					{
						root: this,
						temp: arguments.temp
					}
				);
				arguments.temp.ajax = $.ajax(
					arguments.temp.settings
				);
				arguments.temp.promise = _.assign(
					{},
					arguments.temp.ajax,
					{
						intercept: function (resolve) {
							this.temp.listener.on(
								Constant.Ajax.ActionTypes.DONE,
								function () {
									resolve = !!(!_.isFunction(resolve) ? resolve : resolve.apply(
										this.root,
										[
											Behavior.Error.receive.apply(
												this.root,
												Array.prototype.slice.call(
													arguments
												)
											)
										].concat(
											Array.prototype.slice.call(
												arguments
											)
										)
									));
									return this;
								}.bind(
									this
								)
							);
							return this.temp.promise;
						}.bind(
							{
								root: this,
								temp: arguments.temp
							}
						)
					}
				);
				debug.log(
					'%c Request: %s %o ',
					'background:#000;color:#FFF',
					arguments.temp.settings.url + (arguments.temp.settings.hasOwnProperty('data') ?  '?'+arguments.temp.settings.data : '' ),
					arguments.temp.settings
				);
				return arguments.temp.promise;
			},
			get: function () {
				return this.request(
					{
						url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/cart',
						type: 'GET'
					}
				);
			},
			remove: function (id) {
				return this.request(
					{
						data: {
							skus: Template.JSON.object(
								{
									object: [
										id,
										1,
										''
									].toString(
									)
								}
							).replace(
								/\s+/g,
								''
							)
						},
						url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/cart/remove'
					}
				);
			},
			removeAll: function () {
				return this.request(
					{
						data: {},
						url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/cart/removeall',
						type: 'GET'
					}
				);
			},
			gift: function (sclUUID, checked) {
				return this.request(
					{
						data: {
							sclUUID : sclUUID,
							checked : checked
						},
						url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/cart/wrapitem'
					}
				);
			},
			update: function (id, quantity) {
				return this.request(
					{
						data: {
							skus: Template.JSON.object(
								{
									object: [
										id,
										quantity,
										''
									].toString(
									)
								}
							).replace(
								/\s+/g,
								''
							)
						},
						url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/cart/set'
					}
				);
			},
			Discount: {
				set: function (coupon) {
					return this.request(
						{
							data: {
								couponCodeEntered: coupon
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/coupondu/apply'
						}
					);
				},
				get: function () {
					return this.request(
						{
							data: {},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/coupondu',
							type: 'GET'
						}
					);
				},
				remove: function (coupon) {
					return this.request(
						{
							data: {
								couponCodeEntered: coupon
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/coupondu/remove'
						}
					);
				},
				revoke: function (coupon) {
					return this.request(
						{
							data: {
								couponCodeEntered: coupon
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/coupondu/revoke'
						}
					);
				}
			},
			Shipping: {
				get: function (postalCode) {
					return this.request(
						{
							data: {
								postalCode: postalCode
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/delivery'
						}
					);
				},
				set: {
					method : function (serviceCode, inShopDelivery) {
						return this.request(
							{
								data: {
									serviceCode: serviceCode,
									inShopDelivery: inShopDelivery
								},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/delivery/select'
							}
						);
					},
					shop : function (shopId) {
						return this.request(
							{
								data: {
									sshopId : shopId
								},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/delivery/shop'
							}
						);
					},
				}
			},
			Customer : {
				login : function(login, password){
					return this.request(
						{
							data: {
								login : login,
								password : password
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/login'
						}
					);
				},
				logout : function(){
					return this.request(
						{
							data: {},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/logout',
							type: 'GET'
						}
					);
				},
				cleanup : function(){
					return this.request(
						{
							data: {},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/cleanup',
							type: 'GET'
						}
					);
				},
				exist : function(emailOrDocumentNr){
					return this.request(
						{
							data: {
								emailOrDocumentNr : emailOrDocumentNr
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/checklogin'
						}
					);
				},
				register : function(objectCustomer){
					return this.request(
						{
							data: objectCustomer,
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/register'
						}
					);
				},
				registerAndFreight : function(objectCustomer){
					return this.request(
						{
							data: objectCustomer,
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/registerandfreight'
						}
					);
				},
				pass : {
					change : function(newPassword, token){
						return this.request(
							{
								data: {
									newPassword : newPassword,
									token : token
								},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/changepass'
							}
						);
					},
					send : function(emailOrDocumentNr){
						return this.request(
							{
								data: {
									emailOrDocumentNr : emailOrDocumentNr
								},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/sendpass'
							}
						);
					}
				},
				agree : function(agreeTerm){
					return this.request(
						{
							data: {
								agreeTerm : agreeTerm
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/customer/termagreement'
						}
					);
				}
			},
			Guest : {
				register : function(objectGuest){
					return this.request(
						{
							data: objectGuest,
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/guest/register'
						}
					);
				},
				convert : function(objectGuest){
					return this.request(
						{
							data: objectGuest,
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/guest/convert'
						}
					);
				},
			},
			Address : {
				find : function(postalCode){
					return this.request(
						{
							data: {
								postalCode : postalCode
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/address',
							type: 'GET'
						}
					);
				},
				insert : function(objectAddress){
					return this.request(
						{
							data: {
								address : objectAddress
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/address/insert'
						}
					);
				},
				remove : function(addressId){
					return this.request(
						{
							data: {
								address : {
									addressId : addressId
								}
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/address/remove'
						}
					);
				},
				update : function(objectAddress){
					return this.request(
						{
							data: {
								address : objectAddress
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/address/update'
						}
					);
				},
				select : function(addressId){
					return this.request(
						{
							data: {
								addressId : addressId
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/address/select'
						}
					);
				},
				slots : {
					get : {
						availables : function(){
							return this.request(
								{
									data: {},
									url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/slots',
									type: 'GET'
								}
							);
						},
						first : function(){
							return this.request(
								{
									data: {},
									url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/slots/first',
									type: 'GET'
								}
							);
						}
					},
					reserve : function(slotId){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/slots/reserve/'+slotId,
								type: 'GET'
							}
						);
					},
					validate : function(){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/slots/validate',
								type: 'GET'
							}
						);
					},
					release : function(){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/slots/release',
								type: 'GET'
							}
						);
					}
				}
			},
			Payment : {
				get : function(){
					return this.request(
						{
							data: {},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/payment',
							type: 'GET'
						}
					);
				},
				set : function(paymentKey){
					return this.request(
						{
							data: {
								paymentKey : paymentKey
							},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/payment/selectcardbrand'
						}
					);
				},
				paypal : {
					set : function(){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/payment/paypal/select'
							}
						);
					},
					get_url : function(){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/payment/paypal/geturl'
							}
						);
					}
				}
			},
			Order : {
				get : function(){
					return this.request(
						{
							data: {},
							url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/order/details',
							type: 'GET'
						}
					);
				},
				create : {
					card : function(objectCardOptions){
						return this.request(
							{
								data: objectCardOptions,
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/order/place/creditcard'
							}
						);
					},
					bill : function(paymentKey){
						return this.request(
							{
								data: {
									paymentKey : paymentKey
								},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/order/place/bankslip'
							}
						);
					},
					paypal : function(paypalHash){
						return this.request(
							{
								data: {},
								url: window.acecIndexInformation.cartDomainUrl.replace('https://', '//') + 'api/v1/order/place/paypal/'+paypalHash
							}
						);
					}
				}
			}
		};
	}
);