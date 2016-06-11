(function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/favorites', {
                templateUrl: 'js/app/favorites/favorites.html',
                controller: 'FavoriteController',
                controllerAs: 'viewModel'
            })
            .when('/map', {
                templateUrl: 'js/app/map/map.html',
                controller: 'MapController',
                controllerAs: 'viewModel'
            })
            .when('/yelp/:term', {
                templateUrl: 'js/app/yelp/yelp.html',
                controller: 'YelpController',
                controllerAs: 'viewModel'
            })
            .when('/uber', {
                templateUrl: 'js/app/uber/uber.html',
                controller: 'UberController',
                controllerAs: 'viewModel'
            });
    }
}());