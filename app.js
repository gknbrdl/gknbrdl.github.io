var app = angular.module('app', ['firebase', 'googlechart']).
config(function() {
    var config = {
        apiKey: '496b0900-bee7-46a1-9128-5ca47bf72ff7',
        authDomain: 'https://angular-chart-data.firebaseapp.com',
        databaseURL: 'https://angular-chart-data.firebaseio.com',
        storageBucket: 'gs://angular-chart-data.appspot.com/'
    };
    firebase.initializeApp(config);
});