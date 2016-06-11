(function() {
    'use strict';

    angular
        .module('app')
        .factory('locationInfo', locationFactory);

    function locationFactory() {
        var currentPickUpLocation = {
            name: null,
            address: '1751 Pinnacle Drive, McLean, VA, United States',
            lat: 38.92123,
            long: -77.22836710000001
        };
        
        var desiredDestination = {
            name: 'San Fransico',
            address: 'San Fransico, CA',
            lat: 37.751979,
            long: -122.440692
        };
        
        return {
            getPickUpLocation: getPickUpLocation,
            getDesiredDestination: getDesiredDestination,
            setCurrentPickUpLocation: setCurrentPickUpLocation,
            setDesiredDestination: setDesiredDestination
        };
        function getPickUpLocation(){
            return currentPickUpLocation;
        }
        
        function getDesiredDestination(){
            return desiredDestination;
        }
        
        function setCurrentPickUpLocation(location){
            currentPickUpLocation = location;
        }
        
        function setDesiredDestination(destination){
            desiredDestination = destination;
        }

    }

}());