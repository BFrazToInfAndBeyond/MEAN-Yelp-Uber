(function() {
    'use strict';

    angular
        .module('app')
        .controller('YelpController', YelpController);

    function YelpController(api, $routeParams, $window, $location, ngDialog, $scope, locationInfo, NgTableParams) {
        var viewModel = this;

        viewModel.tableParams = new NgTableParams({}, {});
        viewModel.term = $routeParams.term;
        viewModel.pickupLocation = locationInfo.getPickUpLocation();

        viewModel.getDistance = function(destination) {
            api.getDistance({
                origin: viewModel.desiredDestination.lat + ',' + viewModel.desiredDestination.long,
                destination: destination
            }).then(function(data) {
                return data;
            });
        };

        var init = function() {
            viewModel.responses = [];
            viewModel.pickupLocation = locationInfo.getPickUpLocation();
            viewModel.desiredDestination = locationInfo.getDesiredDestination();

            api.searchYelp({
                    term: viewModel.term,
                    ll: viewModel.desiredDestination.lat + ',' + viewModel.desiredDestination.long,
                    sort: 2
                })
                .then(function(data) {
                    viewModel.data = data;
                    viewModel.bounds = (viewModel.data.businesses.length < 10) ? viewModel.data.businesses.length : 10;
                    for (var i = 0; i < viewModel.bounds; i++) {
                        api.getDistance({
                            index: i,
                            origin: viewModel.desiredDestination.lat + ',' + viewModel.desiredDestination.long,
                            destination: viewModel.data.businesses[i].location.coordinate.latitude + ',' + viewModel.data.businesses[i].location.coordinate.longitude
                        }).then(function(data) {
                            if (data.index == null) {
                                data.index = 0;
                            }
                            var businessToUpdate = viewModel.data.businesses[data.index];
                            businessToUpdate['distanceFromOrigin'] = data.distance;
                            businessToUpdate['eta'] = data.duration;
                            viewModel.data.businesses[data.index] = businessToUpdate;

                            viewModel.responses.push(data.index);
                        });
                    }

                });
        };
        viewModel.searchYelp = function() {
            init();
        };
        
        init();

        viewModel.viewOnMap = function(merchant) {
            var desiredDestination = {
                name: merchant.name,
                address: merchant.location.display_address.join(','),
                lat: merchant.location.coordinate.latitude,
                long: merchant.location.coordinate.longitude,
            };
            locationInfo.setDesiredDestination(desiredDestination);

            $location.url('/map/');
        };

        viewModel.requestUberRide = function(merchant) {

            var desiredDestination = {
                name: merchant.name,
                address: merchant.location.display_address.join(','),
                lat: merchant.location.coordinate.latitude,
                long: merchant.location.coordinate.longitude,
            };
            locationInfo.setDesiredDestination(desiredDestination);

            $location.url('/uber');

        };

        viewModel.goToYelpSite = function(url) {
            $window.open(url, '_blank');
        };

        viewModel.favoriteLocation = function(merchant) {
            viewModel.activeYelpLocation = merchant;

            ngDialog.open({
                template: 'yelpLocation.html', //can be a path to an html template OR the id of a script element
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };
        viewModel.favoritize = function() {
            if (viewModel.activeYelpLocation) {

                var location = {
                    address: viewModel.activeYelpLocation.location.display_address.join(','),
                    lat: viewModel.activeYelpLocation.location.coordinate.latitude,
                    long: viewModel.activeYelpLocation.location.coordinate.longitude,
                };

                api.createFavorite(viewModel.activeYelpLocation.name, location, viewModel.activeYelpLocation.id)
                    .then(function(data) {
                        viewModel.favoriteCreated = data.data;
                    });
                viewModel.activeYelpLocation = null;
                ngDialog.close();
            }
        };
        viewModel.cancel = function() {
            if (viewModel.activeYelpLocation) {
                viewModel.activeYelpLocation = null;
            }

            ngDialog.close();
        };
    }

}());