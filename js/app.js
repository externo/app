'use strict';
angular
    .module('app', ['ngRoute', 'ngResource', 'ngMaterial'])
    .constant('baseUrl', 'https://api.parse.com/1/')
    .constant('headers', {
    headers: {
            'X-Parse-Application-Id': 'iG4CUs7d4EBThmuSPNZynWjoOUvS9sJ9eWEhpKcM',
            'X-Parse-REST-API-Key': 'FsUYdAI8lvNB42KmtIJJqvPrITKYKabm1bWj3tkq',
            "Content-Type" : "application/json"
        }
    }
)
    .constant('headersImage', {
    headers: {
            'X-Parse-Application-Id': 'iG4CUs7d4EBThmuSPNZynWjoOUvS9sJ9eWEhpKcM',
            'X-Parse-REST-API-Key': 'FsUYdAI8lvNB42KmtIJJqvPrITKYKabm1bWj3tkq',
            "Content-Type" : "image/jpeg"
        }
    }
)
    .config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });
    $routeProvider.when('/admin', {
        templateUrl: 'templates/admin/admin.html',
        controller: 'AdminController'
    });
    $routeProvider.when('/login', {
        templateUrl: 'templates/user/login.html',
        controller: 'LoginController'
    });
    $routeProvider.when('/register', {
        templateUrl: 'templates/user/register.html',
        controller: 'RegisterController'
    });
    $routeProvider.otherwise(
        { redirectTo: '/' }
    );
})

// Authorization check: anonymous site visitors cannot access user routes
    .run(function ($rootScope, $location, authService) {
    $rootScope.$on('$locationChangeStart', function () {
        if ($location.path().indexOf("/admin") != -1 && !authService.isLoggedIn()) {
            $location.path("/");
        }
    });
});
