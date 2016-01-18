'use strict';
angular
    .module('app')
    .controller('AdminController', AdminController);

function AdminController($http, baseUrl, headers,
          $scope, $timeout, $mdSidenav, $log, $location, $window, $mdMedia,
          adsService, authService, notifyService, headersImage) {
    var admin = this;
    admin.$mdMedia = $mdMedia;
    var editedAd = {};
    var clickedAdDiv;

    // While window is globally available in JavaScript, it causes testability problems, because it is a global variable. In angular we always refer to it through the $window service, so it may be overridden, removed or mocked for testing.
    // Be aware that when you bind an event handler inside scopes that could be recreated (like ng-repeat scopes, directive scopes,..), you should unbind your event handler when the scope is destroyed. If you don't do this, everytime when the scope is recreated (the controller is rerun), there will be 1 more handler added causing unexpected behavior and leaking.
    // Different execute between regular throttle and debounce - http://demo.nimius.net/debounce_throttle/
    admin.device = {
        direction: $mdMedia('min-width: 12cm') ? 'row' : 'column',
        size: $mdMedia('max-width: 27cm')
    }
    $(window).on("resize.doResize", _.debounce(function (){
        console.log('window width changed ' + JSON.stringify(admin.$mdMedia('width')));
        admin.device = {
            direction: $mdMedia('min-width: 12cm') ? 'row' : 'column',
            size: $mdMedia('max-width: 27cm')
        }
    }, 100));

    //LOGOUT
    $scope.authService = authService;

    // Implement the "logout" button click event handler
    $scope.logout = function() {
        authService.logout();
        notifyService.showInfo("Logout successful");
        $location.path("/");
    };

    // Reload ads function and execution
    $scope.reloadAds = function() {
        adsService.getAds
            .success(function (data) {
                admin.ads = data.results;
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

    // Get ad to handle it
    admin.getAd = function(ad){
        clickedAd(ad);
        admin.newAd = ad;
    };

    $scope.notClickedAd = function(objectId){
        var idSelector = '#' + objectId;
        clickedAdDiv = $(idSelector);

        // Close ad buttons toolbar
        clickedAdDiv.find("input").prop('checked', false);

        // de-blur all ads and header
        $('[md-page-header]').removeClass('blur');
        $('md-list-item')
            .removeClass('blur')
            .removeClass('clicked')
            .addClass('notClicked');
    };

    function clickedAd(ad){
        var idSelector = '#' + ad.objectId;
        clickedAdDiv = $(idSelector);

        // differentiate [click ad buttons toolbar] from [click ad-div]
        clickedAdDiv.click(function(e) {
            e.stopPropagation();
        });
        clickedAdDiv.find(".close").click(function(e) {
            e.stopPropagation();
        });

        // blur header and other ads
        $('[md-page-header]').addClass('blur');
        $('md-list-item')
            .addClass('blur')
            .removeClass('clicked')
            .addClass('notClicked');

        // de-blur clicked ad
        clickedAdDiv
            .removeClass('blur')
            .removeClass('notClicked')
            .addClass('clicked');

        // close/open buttons toolbar
        $("input").prop('checked', false);
        clickedAdDiv.find("input").prop('checked', true);

        editedAd = ad;
    }

    // Upload files to parse.com REST
    $scope.fileSelected1 = function(fileInputField) {
        var file = fileInputField.files[0];
        if (file.type.match(/image\/.*/)) {

            // show image immedeately
            var reader = new FileReader();
            reader.onload = function() {
                $("#image1preview").html("<img class='ad-image' src='" + reader.result + "'>");
            };
            reader.readAsDataURL(file);

            // get simple filename
            var startIndex = file.name.indexOf('\\') >= 0 ? file.name.lastIndexOf('\\') : file.name.lastIndexOf('/');
            var filename = file.name.substring(startIndex);

            //upload image to parse.com
            var requestImage = {
                method: 'POST',
                url: baseUrl + 'files/' + filename,
                headers: headersImage.headers,
                data: file
            };
            $http(requestImage)
                .success(function (imgData) {
                    imgData.__type = 'File';
                    // attach image name to object, next send to parse.com
                    editedAd.img1 = imgData;
                    //notifyService.showInfo("Снимката е качена!");
                })
                .error(function (err) {
                    notifyService.showError("Има проблем със добавянето на снимката!", err);
                });
        } else {
            $("#image1preview").html("<p>Опитваш се да качиш файл, различен от снимка!</p>");
        }
    };

    // Edit ad function
    admin.editAd = function() {
        var request = {
            method: 'PUT',
            url: baseUrl + 'classes/Part/' + editedAd.objectId,
            headers: headers.headers,
            data: editedAd
        };
        $http(request)
            .success(function (data) {
                notifyService.showInfo("Обявата е редактирана.");
                //$scope.reloadAds();
                $scope.editedAd = {};
            })
            .error(function (err) {
                notifyService.showError("Неуспешен опит да редактирате обявата!", err);
                $location.path("/editAd");
            });
    };

    // ad function
    admin.deleteAd = function(objectId) {
        var idSelector = '#' + objectId;
        var deleteAD = $(idSelector);

        var request = {
            method: 'DELETE',
            url: baseUrl + 'classes/Part/' + objectId,
            headers: headers.headers
        };
        $http(request)
            .success(function (data) {
                notifyService.showInfo("Обявата е изтрита.");
                deleteAD.hide();
            })
            .error(function (err) {
                notifyService.showError("Неуспешен опит да изтриете обявата!", err);
            });
    };

    var panel = $('#panel'),
        publish = $('.show-publish');

    admin.toggleCode = function() {
        panel.toggleClass( "viewCode");
        publish
            .toggleClass( "md-accent")
            .toggleClass( "md-primary");
    }
}