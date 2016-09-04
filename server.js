var express = require('express');
// 建立ㄧ個express server
var app = express();
var port = process.env.PORT || 3000;

// 在console印出收到的request
var morgan = require('morgan');

// FB authentication
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// 引入body-parser 模組
var bodyParser = require('body-parser');

// 設定passport及route
require('./config/passport')(passport);

// read cookies (needed for auth)
app.use(cookieParser());

// 設定將req.body JSON化
app.use(bodyParser.json());
// 設定bodyParser支援HTML表單
app.use(bodyParser.urlencoded({
    extended: true
}));

//=====================
//==Passport Setting===
//=====================
// required for passport
app.use(session({
    secret: 'ilovekk',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());


// 連接DB
require('./config/database.js');

//faker模組
var apiRoutes = require('./api/api');


// 設定 express server
// log every request to the console
app.use(morgan('dev'));


// 設定路徑
require('./app/routes.js')(app, passport);

//設定subroute for faker
app.use('/api', apiRoutes);

//讓此目錄下的html都可以作為static file
app.use(express.static(__dirname + '/public'));



//launch==================================================
app.listen(port);
console.log('Server is running on port ' + port + '..........');