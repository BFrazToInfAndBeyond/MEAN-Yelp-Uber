(function() {
    'use strict';

    angular
        .module('app')
        .controller('MapController', MapController);

    function MapController($scope, api, uiGmapGoogleMapApi, ngDialog, $location, locationInfo) {
        var viewModel = this;

        var updateLocation = function(lat, long) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, long);
            geocoder.geocode({
                'latLng': latlng
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        viewModel.desiredDestination.name = null;
                        viewModel.desiredDestination.address = results[1].formatted_address;
                    }
                    else {
                        viewModel.alertUserLocNotFound();
                        console.log('Location not found');
                        return 'Location not found';
                    }
                }
                else {
                    viewModel.alertUserLocNotFound();
                    console.log('Geocoder failed due to: ' + status);
                    return 'Geocoder failed due to: ' + status;
                }

            });
        };

        viewModel.map = {
            center: {
                latitude: locationInfo.getDesiredDestination().lat,
                longitude: locationInfo.getDesiredDestination().long
            },
            options: {
                scrollwheel: true,
                draggable: true
            },
            zoom: 12
        };

        var initialize = function() {
            viewModel.pickupLocation = locationInfo.getPickUpLocation();
            viewModel.desiredDestination = locationInfo.getDesiredDestination();
        };
        initialize();


        //First solution was to set a watch on the latitude.
        // When a user inputs an address, the Geocoder is used
        // to reset

        //on initialization and dragging the marker we start with only the coordinates
        //so in order to obtain the address we'll use the geoCoder to do a
        // 'reverse lookup'.

        //When a user searches for an address, a set of coordinates will be obtained.
        // Note that we don't want to use the geoCoder to do a 'reverse lookup'
        // with the new coordinates, since that the return address may not be the same
        // as the inputted address.

        viewModel.marker = {
            coords: viewModel.map.center,
            id: 'highlyUnique',
            options: {
                draggable: true
            },
            events: {
                dragend: function(marker) {
                    updateLocation(viewModel.map.center.latitude, viewModel.map.center.longitude);
                }

            }

        };
        viewModel.searchbox = {

            template: 'searchbox.tpl.html',
            events: {
                places_changed: function(searchBox) {
                    var places = searchBox.getPlaces();
                    if (places) {
                        viewModel.map.center = {
                            latitude: places[0].geometry.location.lat(),
                            longitude: places[0].geometry.location.lng()
                        };
                        viewModel.marker.coords = viewModel.map.center;
                        //result from autocomplete
                        viewModel.desiredDestination.name = null;
                        viewModel.desiredDestination.address = places[0].formatted_address;
                        viewModel.desiredDestination.lat = viewModel.map.center.latitude;
                        viewModel.desiredDestination.long = viewModel.map.center.longitude;
                        locationInfo.setDesiredDestination(viewModel.desiredDestination);

                    }
                }
            },
            options: {
                visible: true,
                autocomplete: true
            }
        };


        viewModel.favoriteLocation = function() {
            viewModel.activeLocation = JSON.parse(JSON.stringify(viewModel.desiredDestination));

            ngDialog.open({
                template: 'location.html', //can be a path to an html template OR the id of a script element
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };
        viewModel.showYelp = function() {
            var desiredDestination = {
                name: viewModel.desiredDestination.name,
                address: viewModel.desiredDestination.address,
                lat: viewModel.desiredDestination.lat,
                long: viewModel.desiredDestination.long
            };
            locationInfo.setDesiredDestination(desiredDestination);

            $location.url('/yelp/food');
        };
        viewModel.showFavorites = function() {
            $location.url('/favorites');
        };
        viewModel.favoritize = function() {
            if (viewModel.activeLocation) {
                var location = {
                    name: viewModel.activeLocation.name,
                    address: viewModel.desiredDestination.address,
                    lat: viewModel.map.center.latitude,
                    long: viewModel.map.center.longitude
                };

                locationInfo.setDesiredDestination(location);

                api.createFavorite(viewModel.activeLocation.name, location, "")
                    .then(function(data) {
                        viewModel.data = data.data;
                        viewModel.desiredDestination = location;
                    });
                ngDialog.close();
            }
        };
        viewModel.cancel = function() {
            ngDialog.close();
        };

        viewModel.alertUserLocNotFound = function() {
            ngDialog.open({
                template: 'locationNotFound.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        uiGmapGoogleMapApi.then(function(maps) {
            maps.visualRefresh = true;
        });

        viewModel.setPickUpLocation = function() {
            var pickupLocation = null;
            pickupLocation = {
                name: viewModel.desiredDestination.name,
                address: viewModel.desiredDestination.address,
                lat: viewModel.desiredDestination.lat,
                long: viewModel.desiredDestination.long
            };

            locationInfo.setCurrentPickUpLocation(pickupLocation);
            viewModel.pickupLocation = locationInfo.getPickUpLocation();

        };

        viewModel.requestUberRide = function() {
            var desiredDestination = {
                name: viewModel.desiredDestination.name,
                address: viewModel.desiredDestination.address,
                lat: viewModel.map.center.latitude,
                long: viewModel.map.center.longitude
            };
            locationInfo.setDesiredDestination(desiredDestination);
            $location.url('/uber');
        };
    }


}());