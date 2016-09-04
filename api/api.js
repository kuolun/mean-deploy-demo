//輸入網址為: www.example.com/api/foods
//給一個存在的category去產生fake products

// 完整路徑  localhost:3000/api/xxxxxxx(要建立products的目錄名)
var router = require('express').Router();

var faker = require('faker');
var Category = require('../app/models/category');
var Product = require('../app/models/product');

router.get('/:name', function(req, res, next) {
    // DB需要先有對應的category存在，才能建立product
    Category.findOne({
        name: req.params.name
    }, function(err, category) {
        if (err) return next(err);
        // 設定要建立幾筆product
        for (var i = 0; i < 10; i++) {
            var product = new Product();
            product.category = category._id;
            //check faker api
            product.name = faker.commerce.productName();
            product.price = faker.commerce.price();
            product.image = faker.image.image();
            product.save();
        }
        // 都建立完之後再回傳json
        res.json({
            message: 'Success'
        });
    });
});

module.exports = router;