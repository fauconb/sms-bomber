angular.module('starter.controllers', [])

.controller('SpamCtrl',function($scope,$cordovaSms, $timeout, $ionicLoading){

  document.addEventListener("deviceready", function() {
    $ionicLoading.show({
      template: 'Loading contacts...'
    });

    $scope.contacts = [];
    navigator.contacts.find(
        [navigator.contacts.fieldType.displayName],
        gotContacts,
        errorHandler);

        function errorHandler(e) {
            alert("errorHandler: "+e);
        }

        function gotContacts(c) {
            var contacts_filter = [];
            for (var i = 0, len = c.length; i < len; i++) {
              if (c[i].phoneNumbers && c[i].displayName) {
                contacts_filter.push({ name: c[i].displayName, number: c[i].phoneNumbers[0].value });
              }
            }
            $scope.contacts = contacts_filter;
            $ionicLoading.hide();
        }

    $scope.sms_options={};
    $scope.sms_sent = 0;
    $scope.sms_error = 0;
    $scope.is_sending_sms = false;

    $scope.bombSms = function () {
      if ($scope.is_sending_sms) {
        return;
      }
      $scope.is_sending_sms = true;

      for (var i = 0; i < $scope.sms_options.times; ++i) {
        $scope.sendSms($scope.sms_options.delay, i, $scope.sms_options.times, $scope.sms_options.number);
      }
    };

    $scope.setContact = function () {
      $scope.sms_options.number = $scope.sms_options.contact;
    };

  $scope.sendSms = function (delay, i, times, number) {
    $timeout(function() {
      $cordovaSms
      .send(number, $scope.sms_options.message)
        .then(function() {
            $scope.sms_sent++;
        }, function(error) {
            $scope.sms_error++;
      });
      if (i == times - 1) {
        alert(times + ' Messages sent to ' + number);
        $scope.sms_sent = 0;
        $scope.sms_error = 0;
        $scope.is_sending_sms = false;
      }
    }, delay * i);
  };
});
});
