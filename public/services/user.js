//建立userService module
angular.module('userService', [])
    .factory('$User', function($http) {
        var userFactory = {};
        // 建立loadUser method
        userFactory.loadUser = function() {
            $http.
            get('/me').
            success(function(data) {
                userFactory.user = data.user;
                console.log("load User completely!");
            }).
            error(function(data, status) {
                //取得data
                //--錯誤回傳的資料{ error: 'User Not logged in!' }
                if (status === 401) {
                    userFactory.user = null;
                    console.log(data.error);
                }
            });
        };
        // 呼叫method
        userFactory.loadUser();
        return userFactory;
    });