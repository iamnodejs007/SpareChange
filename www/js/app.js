// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ng-walkthrough'])



.run(function($ionicPlatform, $timeout) {

 
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    // org.apache.cordova.statusbar required
    $timeout(function() {
      if(window.StatusBar) {
        StatusBar.styleDefault();
        //StatusBar.hide();
      }
    }, 300);
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('game', {
      url: "/",
      templateUrl: "templates/game.html",
      controller: 'GameCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})

.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {                
            ngModel.$parsers.push(function(val) {                    
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {                    
                return '' + val;
            });
        }
    };
});
