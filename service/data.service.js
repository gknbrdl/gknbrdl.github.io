"use strict";

(function() {
    angular.module('app').factory('GetFireData', GetFireData);

    function GetFireData($firebaseObject) {
        var service = {};
        service.get = get;

        function get() {
            var url = arguments[0] || 'returnObject';
            var ref = firebase.database().ref().child('/' + url);
            var data = $firebaseObject(ref);
            return data.$loaded().then(function() {
                var objectdata = [];
                for (var k in data) {
                    var item = data[k];
                    if (typeof item === 'object' && item !== 'undefined' && item !== null)
                        objectdata.push(item);
                }

                return objectdata;
            });
        }

        return service;
    }
})(angular);