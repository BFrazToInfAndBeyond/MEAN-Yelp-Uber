(function() {
    'use strict';

    angular
        .module('app')
        .factory('api', apiFactory);

    apiFactory.$inject = ['$http'];

    function apiFactory($http) {

        return {
            getFavorites: getFavorites,
            createFavorite: createFavorite,
            deleteFavorite: deleteFavorite,
            searchYelp: searchYelp,
            getDistance: getDistance,
            getUberProducts: getUberProducts,
            getUberEtaForLocation: getUberEtaForLocation
        };

        function getFavorites() {
            return $http.get('/favorites/api/get-favorites')
                .then(function(response) {
                    return response.data;
                });
        }

        function createFavorite(name, location, yelp_id) {
            return $http.post('/favorites/api/create-favorite', {
                name: name,
                location: location,
                yelp_id: yelp_id
            }).then(function(response) {
                return response.data;
            });
        }

        function deleteFavorite(id) {
            return $http.delete('/favorites/api/delete-favorite/' + id)
                .then(function(response) {
                    return response.data;
                });
        }

        function searchYelp(queryObj) {
            return $http.post('/yelp/api/search', queryObj).then(function(response) {
                    return response.data;
                });
        }
        
        function getDistance(queryObj){
            return $http.post('/distance/api/get-distance', queryObj).then(function(response) {
                    return response.data;
                });
        }
        

        function getUberProducts(lat, long){
            return $http.get('/uber/api/products/' + lat + "/" + long).then(function(response) {
                return response.data;
            });
        }
        
        function getUberEtaForLocation(lat, long){
            return $http.get('/uber/api/eta-for-location/' + lat + "/" + long).then(function(response) {
                return response.data;
            });
        }
    }

}());