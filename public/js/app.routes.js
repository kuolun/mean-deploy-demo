// Front-End

//建立routerRoutes
//dependencies: ngRoute
var app = angular.module('routerRoutes', ['ngRoute']);

//注入$routeProvider
app.config(function($routeProvider) {
    $routeProvider
    //實際為 www.example.com/#/products/xxxxx
    //1.取得分類下所有產品
        .when('/products/:categoryid', {
            template: '<category-products></category-products>'
        })
        // 2.產品detail頁 
        .when('/product/:productid', {
            template: '<product></product>'
        })
        // 3.首頁
        .when('/', {
            template: '<category-products></category-products>'
        })
        // 3.1 for FB login
        .when('/_=_', {
            template: '<category-products></category-products>'
        })
        //4.User Profile頁面
        .when('/profile', {
            template: '<profile></profile>'
        })
        //5.購物車頁面
        .when('/cart', {
            template: '<cart></cart>'
        });



});