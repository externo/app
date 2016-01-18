'use strict';
angular
    .module('app')
    .controller('LoginController', LoginController);

function LoginController($scope, $rootScope, $location, authService, notifyService) {
    $scope.login = function(userData) {
        authService.login(userData,
            function success() {
                notifyService.showInfo("Успешно влизане!");
                $location.path("/admin");
            },
            function error(err) {
                notifyService.showError("Потребителя/паролата са грешни.", err);
            }
        );
    };
}