'use strict';
angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController(adsService, notifyService, $mdDialog) {
    var home = this;
    home.reloadAds = function() {
        adsService.getAds
            .success(function (data) {
                home.ads = data.results;
                notifyService.showInfo("Обявите са зарадени успешно.");
                notifyService.showSimpleToast("© 2016 kataraga.com - динамични уеб страници", 2000);
            })
            .error(function (err) {
                notifyService.showError("Има проблем със зареждането на обявите!", err);
            }
        );
    };
    home.reloadAds();

    // Handle Dialog windows
    home.showAdDialog = function(ev, ad) {
        var template = '<md-dialog>' +
            '<form>' +
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
            '<md-content class="md-padding">' +
            '<img class="ad-image" ng-src="' + ad.img1.url + '" />' +
            '</md-content>' +
            '</md-tab>' +
            '<md-tab label="Снимка 2">' +
            '<md-content class="md-padding">' +
            '<img class="ad-image" ng-src="' + ad.img2.url + '" />' +
            '</md-content>' +
            '</md-tab>' +
            '</md-tabs>' +
            '</md-dialog-content>' +
            '<md-dialog-actions layout="row">' +
            '<md-button class="">' + ad.description.text + '</md-button>' +
            '<span flex></span>' +
            '<md-button class="md-raised">' + ad.description.price + '</md-button>' +
            '</md-dialog-actions>' +
            '</form>' +
            '</md-dialog>';
        ShowDialog($mdDialog, ev, template);
    };
}
