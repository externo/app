'use strict';
function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

function ShowDialog($mdDialog, ev, template){
    $mdDialog.show({
        controller: DialogController,
        template: template,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
    });
}
