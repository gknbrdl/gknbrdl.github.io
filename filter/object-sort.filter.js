"use strict";

(function() {
    angular.module('app').filter('orderObjectBy', orderObjectBy);

    function orderObjectBy() {
        var filter = filter;

        function filter(items, field, reverse) {
            var filtered = [];
            for (var k in items) {
                var item = items[k];
                filtered.push(item);
            }
            filtered.sort(function(a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        }

        return filter;
    }
})(angular);