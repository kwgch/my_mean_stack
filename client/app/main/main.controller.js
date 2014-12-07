'use strict';

angular.module('myMeanApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
      if ($scope.checked) {
        $scope.newThing = '';
        $scope.thing_id = '';
        $scope.checked = false;
      }
    };

    $scope.editThing = function(thing) {
      $scope.newThing = thing.name;
      $scope.thing_id = thing._id;
      $scope.checked = true;
    };

    $scope.updateThing = function() {
      $http.patch('/api/things/' + $scope.thing_id, { name: $scope.newThing });
      $scope.newThing = '';
      $scope.thing_id = '';
      $scope.checked = false;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
