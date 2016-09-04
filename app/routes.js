module.exports = function(app, passport) {
    // 建立API

    //取得category model
    var Category = require('./models/category');

    //取得product model
    var Product = require('./models/product');

    //Stripe結帳
    var Stripe = require('stripe')(process.env.SKKEY);

    //取得user model
    var User = require('./models/user');


    // parse path
    var path = require('path');

    // Homepage
    app.get('/', function(req, res) {
        // console.log("req.session in /");
        // console.log(req.session);
        // if (req.session.passport.user) {
        //     res.send("Hello ,user:" + req.session.passport.user);
        // } else {
        //     res.send("logout successful!");
        // }
        // __dirname returns the directory that the currently executing script is in.
        res.sendFile(path.join(__dirname, '../public/views', 'index.html'));
    });





    //about
    app.get('/about', function(req, res) {
        res.send("Hello from about");
    });


    // =====================================
    // Category SECTION ====================
    // =====================================

    //用id找出特定目錄
    app.get('/category/id/:id', function(req, res) {
        // 用Category Model去找data
        // 對應的collection為categories
        Category.findOne({
            _id: req.params.id
        }, function(error, category) {
            //錯誤處理
            if (error) {
                // internal server error
                return res.status(500).
                json({
                    error: error.toString()
                });
            }
            //category不存在
            if (!category) {
                // data not found
                return res.status(404)
                    .json({
                        error: 'Not found'
                    });
            }
            //有data就回傳json
            res.json({
                category: category
            });
        });
    });

    //取得所有目錄for dropdown
    app.get('/categories/all', function(req, res) {
        //空{}代表傳回categories下所有document
        Category.find({}, function(error, categories) {
            if (error) {
                return res.status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                categories: categories
            });
        });
    });

    // 新增目錄
    app.post('/addCategory', function(req, res) {
        var category = new Category();
        category.name = req.body.name;

        category.save(function(err, category) {
            res.json({
                category: category
            });
        });
    })


    // =====================================
    // Product SECTION =====================
    // =====================================

    //id對應category，取得某一目錄下所有products
    app.get('/products/:id', function(req, res, next) {
        Product
            .find({
                category: req.params.id
            })
            // 將category path替換成對應的資料
            .populate('category')
            .exec(function(err, products) {
                if (err) return next(err);
                // 取到資料就回傳json
                res.json({
                    products: products
                });
            });
    });

    //取得所有product
    app.get('/productsall/', function(req, res) {
        //空{}代表傳回Category下所有document
        Product.find({})
            .populate('category')
            .exec(function(error, products) {
                if (error) {
                    return res.status(500).
                    json({
                        error: error.toString()
                    });
                }
                res.json({
                    products: products
                });
            });
    });


    // =====================================
    // Product Detail SECTION ==============
    // =====================================
    //用id找特定product
    app.get('/product/:id', function(req, res) {
        Product.findById({
            _id: req.params.id
        }, function(err, product) {
            if (err) return next(err);
            //回傳json
            res.json({
                product: product
            });
        })
    });



    // =====================================
    // Get Cart Page SECTION ==============
    // =====================================

    //取出User的Cart資料 (for <cart>)
    app.get('/cart', function(req, res, next) {
        // 利用req.user._id去DB比對是否有此user
        User.findOne({
                _id: req.user._id
            })
            //因為product的type為ObjectId所以要populate
            .populate('data.cart.product')
            .exec(function(err, user) {
                if (err) return next(err);
                res.json({
                    user: user
                });
            });
    });

    // =====================================
    // Update Cart SECTION ==============
    // =====================================
    // 更新DB中User的Cart內容 (for <addToCart>)
    // 更新用put
    app.put('/updateCart', function(req, res, next) {
        User.findById({
            _id: req.user._id
        }, function(err, user) {
            user.data.cart.push({
                //put傳來的
                product: req.body.productid,
                quantity: parseInt(req.body.quantity),
                subtotal: parseInt(req.body.subtotal)
            });
            // req.body內為JSON，是string(透過bodyParser處理)
            user.data.totalValue = (user.data.totalValue + parseInt(req.body.subtotal));
            user.save(function(err, user) {
                if (err) return next(err);
                // 回傳save後的user
                return res.json({
                    user: user
                });
            });
        });

    });


    // =====================================
    // Remove item in Cart  SECTION ========
    // =====================================
    //移除Cart內資料 (for <cart>)
    app.put('/remove', function(req, res, next) {
        User.findOne({
            // 有登入的傳進來的req會帶有user資料(req.user)
            _id: req.user._id
        }, function(err, foundUser) {
            // 利用ObjectId移除該item
            foundUser.data.cart.pull(String(req.body.itemid));
            foundUser.data.totalValue = (foundUser.data.totalValue - parseInt(req.body.subtotal));
            foundUser.save(function(err, found) {
                if (err) return next(err);
                res.json(found);
            });
        });
    });

    //--done
    //Load目前登入user的購物車資料
    app.get('/me', function(req, res) {
        //check是否有user登入
        if (!req.user) {
            return res.status(401).
            json({
                error: 'User Not logged in!'
            });
        }
        //user已登入,req.user存在(FB 驗證後會回傳user資料)
        //替換user中data.cart.product資料
        req.user.populate({
            path: 'data.cart.product',
            model: 'Product'
        }, function(error, user) {
            //錯誤處理
            if (error) {
                return res.status(500).
                json({
                    error: error.toString()
                });
            } //資料找不到
            if (!user) {
                return res.status(404).
                json({
                    error: 'Not found'
                });
            }
            // populate完回傳
            res.json({
                user: user
            });
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // 因為strategy那邊沒有給name，所以預設是facebook
    // scope :要求更多權限
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    // 一旦user成功通過fb認證 整個session都可存取req.user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );



    // =====================================
    // LOGOUT ==============================
    // =====================================
    // passport的logout，會把session移除
    app.get('/logout', function(req, res) {
        // provided by passport.
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // payment ==============================
    // =====================================
    app.post('/payment', function(req, res) {
        Stripe.charges.create({
                // 從req.user.data去抓要charge的資料
                //Stripe的價格要用cents所以x100且四捨五入
                // for test
                // amount: 888,
                amount: Math.ceil(req.user.data.totalValue * 100),
                currency: 'usd',
                source: req.body.stripeToken, //取得stripeToken
                description: 'Example charge from kuolun'
            },
            //成功的話會拿到charge object
            function(err, charge) {
                if (err && err.type === 'StripeCardError') {
                    return res.status(400).
                    json({
                        error: err.toString()
                    });
                }
                if (err) {
                    return res.status(500).
                    json({
                        error: err.toString()
                    });
                }
                // 清空購物車
                req.user.data.cart = [];
                req.user.data.totalValue = 0;
                req.user.save(function() {
                    // 成功的話回傳id及狀態
                    return res.json({
                        id: charge.id,
                        status: charge.status
                    });
                });
                // // for test
                // res.send("charge success!");
            });
    });



    // =====================================
    // Search SECTION ======================
    // =====================================
    //text search
    app.get('/search/:query', function(req, res) {
        console.log("in api...");
        console.log(req.params.query);
        Product.
        find({ // schema有設定$text對應name欄位
                $text: {
                    $search: req.params.query
                }
            }, { // 設定$meta
                score: {
                    $meta: 'textScore'
                }
            })
            // 替換category
            .populate('category')
            // 設定照textScore排序
            .sort({
                score: {
                    $meta: 'textScore'
                }
            }).
        limit(10).
        exec(function(err, result) {
            // 回傳result為array
            //no error,回傳json物件，有property屬性
            var json = {};
            //建立一個products陣列，儲存特定目錄的product
            json['result'] = result;
            res.json(json);
        });
    });




};