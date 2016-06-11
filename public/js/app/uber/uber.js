(function() {
    'use strict';

    angular
        .module('app')
        .controller('UberController', UberController);

    function UberController(api, $window, $location, ngDialog, $scope, locationInfo, NgTableParams) {
        var viewModel = this;

        viewModel.tableParams = new NgTableParams({}, {});

        var init = function() {
            viewModel.pickupLocation = locationInfo.getPickUpLocation();
            viewModel.desiredDestination = locationInfo.getDesiredDestination();
            if (viewModel.pickupLocation && viewModel.desiredDestination) {
                api.getUberProducts(viewModel.pickupLocation.lat, viewModel.pickupLocation.long).
                then(function(data) {
                    viewModel.uberProducts = data.products;
                    api.getUberEtaForLocation(viewModel.pickupLocation.lat, viewModel.pickupLocation.long).then(function(data) {
                        viewModel.uberEtaForLocation = data.times;
                        for (var i = 0; i < viewModel.uberProducts.length; i++) {
                            var etaFound = false;
                            var j = 0;
                            while (!etaFound && j < viewModel.uberEtaForLocation.length) {
                                if (viewModel.uberProducts[i].display_name == viewModel.uberEtaForLocation[j].display_name) {
                                    viewModel.uberProducts[i].eta = viewModel.uberEtaForLocation[j].estimate / 60;
                                    etaFound = true;
                                }
                                j += 1;
                            }
                        }
                    });
                    api.getDistance({
                        origin: viewModel.desiredDestination.lat + ',' + viewModel.desiredDestination.long,
                        destination: viewModel.pickupLocation.lat + ',' + viewModel.pickupLocation.long
                    }).then(function(data) {
                        for (var i = 0; i < viewModel.uberProducts.length; i++) {
                            viewModel.uberProducts[i].avgPrice = viewModel.getPriceForProduct(viewModel.uberProducts[i].price_details, data.distanceValue, data.durationValue);
                        }
                    });
                });
            }
        };
        init();
        setInterval(init, 10000);

        viewModel.getPriceForProduct = function(price_details, distanceValue, durationValue) {
            var avgPrice = null;

            if (price_details) {
                if (price_details.base) {
                    avgPrice += price_details.base;
                }
                if (price_details.service_fees) {
                    for (var i; i < price_details.service_fees.length; i++) {
                        avgPrice += price_details.service_fees[i].fee;
                    }
                }
                if (price_details.cost_per_minute && price_details.cost_per_distance) {
                    avgPrice += price_details.cost_per_minute * (durationValue / 60); //duration value is in seconds. Thus we convert to minutes
                    avgPrice += price_details.cost_per_distance * (distanceValue / 1609.34); //distance value is in meters. Thus we convert to miles
                }
                avgPrice = Math.max(price_details.minimum, avgPrice).toFixed(2);
            }
            return avgPrice; //Note: we do not factor in surge pricing.
        };

        viewModel.validRideRequest = function() {
            if ((viewModel.pickupLocation.lat == viewModel.desiredDestination.lat && viewModel.pickupLocation.long == viewModel.desiredDestination.long) || viewModel.pickupLocation.address == viewModel.desiredDestination.address) {
                return false;
            }
            return true;
        };

        viewModel.requestUberRide = function(product) {
            ngDialog.open({
                template: 'wip_info.html', //can be a path to an html template OR the id of a script element
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        };

        viewModel.proceed = function() {
            ngDialog.close();
        };

        viewModel.placeHolderEmpty = function(input) {

            if (!(input == undefined || input == null)) {
                return input;
            }
            else {
                return "-";
            }

        };
    }

}());