"use strict";

(function() {
    angular.module('app').directive('chartReport', ChartReport);

    function ChartReport() {
        var directive = {
            restrict: 'E',
            transclude: false,
            scope: {},
            templateUrl: 'directive/chart.directive.html',
            controller: DirectiveController,
            controllerAs: 'vm'
        };

        function DirectiveController(GetFireData, $timeout, $filter, $scope) {
            var vm = this;
            vm.init = init;
            vm.ischart = true;
            vm.chartLoad = chartLoad;
            vm.search = search;
            vm.dateobj = [];
            vm.newtemp = {};
            vm.query = {};
            vm.sort = 5;
            vm.getMonths = getMonths;

            function init() {
                vm.query = {};
                vm.reportchart = "";
                vm.viewyear = String(new Date().getFullYear());
                vm.viewmonth = "1";
                vm.yearlist = [];
                var x = new Date().getFullYear() + 1;
                while (x >= 2011) vm.yearlist.push(x), x--;
                search();
            }

            function search() {
                var d = new Date(Number(vm.viewyear), Number(vm.viewmonth) - 1, 1);
                vm.query.DepartureStartDate = $filter('date')(d, 'yyyy-MM-dd');
                vm.query.DepartureEndDate = $filter('date')(d.setFullYear(Number(vm.viewyear) + 1, Number(vm.viewmonth) - 1, 0), 'yyyy-MM-dd');

                GetFireData.get().then(function(res) {
                    var temp = angular.copy(res);
                    var newtemp = {};
                    for (var k in temp) {
                        var item = temp[k];
                        if (!angular.isDefined(item.FlightDate)) continue;
                        var date = new Date(item.FlightDate.split('-')[0], item.FlightDate.split('-')[1] - 1, 1).getTime();
                        if (angular.isUndefined(newtemp[item.AirlineCode]))
                            newtemp[item.AirlineCode] = {},
                            newtemp[item.AirlineCode].name = item.AirlineCode,
                            newtemp[item.AirlineCode].image = false,
                            newtemp[item.AirlineCode].total = 0,
                            newtemp[item.AirlineCode].month = getMonths(),
                            newtemp[item.AirlineCode].group = {};
                        newtemp[item.AirlineCode].total += Number(item.TotalTicket);
                        newtemp[item.AirlineCode].month[date].total += Number(item.TotalTicket);

                        if (angular.isUndefined(newtemp[item.AirlineCode].group[item.ClassGroup]))
                            newtemp[item.AirlineCode].group[item.ClassGroup] = {},
                            newtemp[item.AirlineCode].group[item.ClassGroup].total = 0,
                            newtemp[item.AirlineCode].group[item.ClassGroup].month = getMonths(),
                            newtemp[item.AirlineCode].group[item.ClassGroup].class = {};
                        newtemp[item.AirlineCode].group[item.ClassGroup].total += Number(item.TotalTicket);
                        newtemp[item.AirlineCode].group[item.ClassGroup].month[date].total += Number(item.TotalTicket);

                        if (angular.isUndefined(newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName]))
                            newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName] = {},
                            newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName].total = 0,
                            newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName].month = getMonths();
                        newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName].total += Number(item.TotalTicket);
                        newtemp[item.AirlineCode].group[item.ClassGroup].class[item.ClassName].month[date].total += Number(item.TotalTicket);

                        if (angular.isUndefined(newtemp['total']))
                            newtemp['total'] = {},
                            newtemp['total'].name = "Toplam",
                            newtemp['total'].total = 0,
                            newtemp['total'].month = getMonths();
                        newtemp['total'].total += Number(item.TotalTicket);
                        newtemp['total'].month[date].total += Number(item.TotalTicket);
                    }
                    var tmp = angular.copy(newtemp);
                    delete tmp.total;
                    tmp = $filter('orderObjectBy')(tmp, 'total', 'reverse');
                    tmp.total = newtemp.total;
                    vm.newtemp = tmp;

                    $scope.$watch(function() {
                        return vm.newtemp;
                    }, function(data) {
                        if (typeof data !== "undefined" && angular.isObject(data)) {
                            chartLoad();
                        }
                    });
                });
            }

            function getMonths() {
                var months = {};
                var i = 1;
                var date = new Date(vm.query.DepartureStartDate.split('-')[0], vm.query.DepartureStartDate.split('-')[1] - 1, 1).getTime();
                while (i < 13) {
                    months[date] = {};
                    months[date].name = $filter('date')(date, 'MMMM');
                    months[date].year = $filter('date')(date, 'yyyy');
                    months[date].month = $filter('date')(date, 'MM');
                    months[date].time = date;
                    months[date].total = 0;
                    date = new Date(date);
                    date = date.setMonth(date.getMonth() + 1);
                    i++;
                }
                return months;
            }

            function chartLoad() {
                var rows = [];
                var rw = [];
                var temp = [];
                var series = {};
                var months = getMonths();
                var cols = [{
                    id: "month",
                    label: "Aylık",
                    type: "string"
                }];

                for (var i in vm.newtemp) {
                    var item = vm.newtemp[i];
                    if (item.check) {
                        temp[i] = item;
                    }
                }
                var n = 0;
                for (var k in temp) {
                    cols.push({
                        id: k,
                        label: temp[k].name,
                        type: 'number'
                    });
                    series[n] = {};
                    series[n].pointSize = 5;
                    n++;
                }
                for (var i in months) {
                    var mnth = months[i];
                    rows[i] = {};
                    rows[i].c = [];
                    rows[i].c.push({
                        v: mnth.name
                    });
                    for (var k in temp) {
                        var item = temp[k];
                        rows[i].c.push({
                            v: item.month[i].total,
                            f: item.month[i].total + " Adet"
                        });
                    }

                }
                for (var k in rows) {
                    var item = rows[k];
                    rw.push(item);
                }
                vm.reportchart = {};
                vm.reportchart.type = "AreaChart";
                vm.reportchart.displayed = true;
                vm.reportchart.data = {};
                vm.reportchart.data.cols = cols;
                vm.reportchart.data.rows = rw;

                vm.reportchart.options = {
                    legend: {
                        position: 'bottom'
                    },
                    fontName: 'Lato',
                    backgroundColor: {
                        stroke: 'black',
                        fill: 'transparent',
                        strokeSize: 1
                    },
                    chartArea: {
                        'width': '90%',
                        'height': '70%'
                    },
                    datalessRegionColor: '#29ABE2',
                    colorAxis: {
                        colors: ['#0071BC']
                    },
                    keepAspectRatio: false,
                    animation: {
                        startup: true,
                        duration: 1000,
                        easing: 'out'
                    }
                };

                vm.reportchart.options.series = series;
            }

        }

        return directive;
    }
})(angular);