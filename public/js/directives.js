//使用ShopApp module
var app = angular.module('ShopApp');

// 1.Navbar+user登入狀態列
app.directive('navBar', function() {
    return {
        controller: 'NavBarController',
        templateUrl: '/views/pages/nav_bar.html'
    };
});

//2.下拉目錄選單(dropdown)
app.directive('dropdownCategories', function() {
    return {
        controller: 'dropdownCategoriesController',
        templateUrl: '/views/pages/dropdown_categories.html'
    };
});

//3.分類下的所有產品
app.directive('categoryProducts', function() {
    return {
        controller: 'CategoryProductsController',
        templateUrl: '/views/pages/category.html'
    };
});

//4. 產品detail頁
app.directive('product', function() {
    return {
        controller: 'ProductController',
        templateUrl: '/views/pages/product.html'
    };
});


// 5.User Profile
app.directive('profile', function() {
    return {
        controller: 'userController',
        templateUrl: '/views/pages/profile.html'
    };
});

//6.購物車頁面
app.directive('cart', function() {
    return {
        controller: 'cartController',
        templateUrl: '/views/pages/cart.html'
    };
});


// 7.search bar
app.directive('searchBar', function() {
    return {
        controller: 'SearchBarController',
        templateUrl: '/views/pages/search_bar.html'
    };
});