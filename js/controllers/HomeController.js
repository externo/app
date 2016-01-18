'use strict';
angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController($scope, adsService, notifyService, $mdDialog) {
    var home = this;

    // Reload ads function and execution
    $scope.reloadAds = function() {
        adsService.getAds
            .success(function (data) {
                home.ads = data.results;
                notifyService.showInfo("Обявите са заредени успешно...");
            })
            .error(function (err) {
                notifyService.showError("Има проблем със зареждането на обявите!", err);
            }
        );

        adsService.getCategories
            .success(function(data){
                $scope.categories = data.results;
            })
    };
    $scope.reloadAds();

    // Handle Dialog windows
    home.showAdDialog = function(ev, ad) {
        var template =
            '<md-dialog>' +
                '<md-toolbar>' +
                    '<div class="md-toolbar-tools">' +
                        '<h2>' + ad.description.name + '</h2>' +
                        '<span flex></span>' +
                        '<md-button class="md-icon-button" ng-click="cancel()">' +
                            '<md-icon md-svg-src="img/icons/close.svg" aria-label="Затвори"></md-icon>' +
                        '</md-button>' +
                    '</div>' +
                '</md-toolbar>' +

                '<md-dialog-content>' +
                    '<md-tabs md-dynamic-width md-dynamic-height md-border-bottom>' +

                        '<md-tab label="Снимка 1">' +
                            '<img class="shelf-img" ng-src="' + ad.img1.url + '" />' +
                        '</md-tab>' +

                        '<md-tab label="Снимка 2">' +
            '<img class="shelf-img" ng-src="' + ad.img1.url + '" />' +
                        '</md-tab>' +
                    '</md-tabs>' +
                '</md-dialog-content>' +

                '<md-dialog-actions layout="row">' +
                    '<md-button class="">' + ad.description.text + '</md-button>' +
                        '<span flex></span>' +
                    '<md-button class="md-raised">' + ad.description.price + '</md-button>' +
                '</md-dialog-actions>' +
            '</md-dialog>';
        ShowDialog($mdDialog, ev, template);
    };
}
