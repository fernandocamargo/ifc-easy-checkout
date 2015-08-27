/* global require, ifcEvents */
require.config(
	{ 
		waitSeconds: window.IFC_CKOUT_VARIABLES.timeoutAppLoad || 30
	}
);
require(
	[
		'domReady',
		'ifc-app-easy-checkout'
	],
	function (document, app) {
		'use strict';
		window.ifcAppCkout = app;
		window.ifcAppCkout.init.call(
			window.ifcAppCkout
		);
	}
);