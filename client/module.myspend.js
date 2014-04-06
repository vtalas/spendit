/*global angular*/
"use strict";

angular.module('mySpend', ['ngResource'])
	.factory('api', ['$resource', function ($resource) {
		return $resource('/api',
			{  },
			{
				index: { method: 'GET', isArray: false, params: {} }
			});
	}]);

