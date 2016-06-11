'use strict';

var MyApp = angular.module('app', ['ngRoute', 'ngDialog', 'uiGmapgoogle-maps', 'ngTable']);

//explicitly defining what gets injected
MyApp.config(function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/map'
    });
});


MyApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCtijMV-gO4rIubxTUpXsxdZUBqdPQ9RMA',
        v: '3.20',
        libraries: 'places'
    });
});