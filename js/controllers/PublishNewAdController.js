'use strict';
angular
    .module('app')
    .controller('PublishNewAdController', PublishNewAdController);

function PublishNewAdController($scope, $location, $http, headers, headersImage, baseUrl,
                                adsService, notifyService) {
    var publish = this;
    publish.adData = {};
    $scope.fileSelected1 = function(fileInputField) {
        var file = fileInputField.files[0];
        if (file.type.match(/image\/.*/)) {

            // show image immedeately
            var reader = new FileReader();
            reader.onload = function() {
                $("#upload-image")
                    .html("<span></span>" +
                            "<label class='md-button' md-ink-ripple for='image'>" +
                                "<img src='" + reader.result + "'>" +
                            "</label>" +
                        "<input id='image' type='file' onchange='angular.element(this).scope().fileSelected1(this)' />");
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
                    publish.adData.img1 = imgData;
                    notifyService.showInfo("Снимката е качена!");
                })
                .error(function (err) {
                    notifyService.showError("Има проблем със добавянето на снимката!", err);
                });
        } else {
            $("#upload-image").html("<p>Опитваш се да качиш файл, различен от снимка!</p>");
        }
    };

    //function that publishes the AD
    publish.publishAd = function(adData) {
        var request = {
            method: 'POST',
            url: baseUrl + 'classes/Part',
            headers: headers.headers,
            data: adData
        };
        $http(request)
            .success(function (data) {
                notifyService.showInfo("Обявата е добавена успешно.");

                //add child element and do not reload!
                $scope.reloadAds();
            })
            .error(function (err) {
                notifyService.showError("Има проблем със добавянето на обявата!", err);
            });
    };

}
