'use strict';
angular
    .module('app')
    .factory('authService', authService);

function authService($http, baseUrl, headers) {
    return {
        login: function(userData, success, error) {
            var url = baseUrl + 'login' + '?username=' + userData.username + '&password=' + userData.password;
            $http.get(url, headers)
                .success(function(data) {
                    sessionStorage['currentUser'] = JSON.stringify(data);
                    success(data);
                })
                .error(error);
        },
        register: function(userData, success, error) {
            var request = {
                method: 'POST',
                url: baseUrl + 'users',
                data: userData
            };
            $http(request)
                .success(function(data) {
                    sessionStorage['currentUser'] = JSON.stringify(data);
                    success(data);
                })
                .error(error);
        },
        logout: function() {
            delete sessionStorage['currentUser'];
        },
        getCurrentUser : function() {
            var userObject = sessionStorage['currentUser'];
            if (userObject) {
                return JSON.parse(sessionStorage['currentUser']);
            }
        },
        isAnonymous : function() {
            return sessionStorage['currentUser'] == undefined;
        },
        isLoggedIn : function() {
            return sessionStorage['currentUser'] != undefined;
        },
        isNormalUser : function() {
            var currentUser = this.getCurrentUser();
            return (currentUser != undefined) && (!currentUser.isAdmin);
        },
        isAdmin : function() {
            var currentUser = this.getCurrentUser();
            return (currentUser != undefined) && (currentUser.isAdmin);
        },
        getAuthHeaders : function() {
            var headers = {};
            var currentUser = this.getCurrentUser();
            if (currentUser) {
                headers['Authorization'] = 'Bearer ' + currentUser.access_token;
            }
            return headers;
        }
    }
}
