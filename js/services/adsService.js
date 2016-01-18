'use strict';
angular
    .module('app')
    .factory('adsService', adsService);

function adsService($http, baseUrl, headers) {
    var adsUrl = baseUrl + 'classes/Part';
    var categoriesUrl = baseUrl + 'classes/Category';
    return {
        getAds: $http.get(adsUrl, headers),
        getCategories: $http.get(categoriesUrl, headers)
    }
}