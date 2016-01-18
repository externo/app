'use strict';
angular
    .module('app')
    .controller('RegisterController', RegisterController);

function RegisterController($scope, $location, townsService, authService, notifyService) {
    $scope.userData = {townId: null};
    $scope.towns = townsService.getTowns();
    $scope.register = function(userData) {
        authService.register(userData,
            function success() {
                notifyService.showInfo("Register successful");
                $location.path("/login");
            },
            function error(err) {
                notifyService.showError("User registration failed", err);
            }
        );
    };
}
