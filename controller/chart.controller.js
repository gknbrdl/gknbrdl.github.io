"use strict";

(function() {
    angular.module('app').controller('ChartController', ChartController);

    function ChartController(GetFireData, $scope) {
        var vm = this;
        vm.init = init;

        function init() {}

    }
})(angular);