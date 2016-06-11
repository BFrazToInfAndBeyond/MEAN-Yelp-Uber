(function() {
    'use strict';

    angular
        .module('app')
        .controller('FavoriteController', FavoriteController);

    function FavoriteController(api, $location, ngDialog, $scope, locationInfo, NgTableParams) {
        var viewModel = this;

        viewModel.tableParams = new NgTableParams({}, {});

        viewModel.pickupLocation = locationInfo.getPickUpLocation();
        api.getFavorites()
            .then(function(data) {
                viewModel.data = data;
            });

        viewModel.remove = function(fav) {
            viewModel.fav_to_delete = fav;
            ngDialog.open({
                template: 'delete.html', //can be a path to an html template OR the id of a script element
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        viewModel.cancel = function() {
            ngDialog.close();
        };

        viewModel.yes_delete = function() {

            api.deleteFavorite(viewModel.fav_to_delete._id)
                .then(function(data) {
                    api.getFavorites()
                        .then(function(data) {
                            viewModel.data = data;

                        });
                });
            ngDialog.close();
        };

        viewModel.viewOnMap = function(fav) {
            var desiredDestination = {
                name: fav.name,
                address: fav.location.address,
                lat: fav.location.lat,
                long: fav.location.long
            };
            locationInfo.setDesiredDestination(desiredDestination);
            $location.url('/map/' + fav.location.lat + '/' + fav.location.long);
        };

        viewModel.requestUberRide = function(fav) {
            var desiredDestination = {
                name: fav.name,
                address: fav.location.address,
                lat: fav.location.lat,
                long: fav.location.long
            };
            locationInfo.setDesiredDestination(desiredDestination);
            $location.url('/uber');
        };

        viewModel.setPickUpLocation = function(fav) {
            var pickupLocation = {
                name: fav.name,
                address: fav.location.address,
                lat: fav.location.lat,
                long: fav.location.long
            };
            locationInfo.setCurrentPickUpLocation(pickupLocation);
            viewModel.pickupLocation = locationInfo.getPickUpLocation();
        };
    }

}());