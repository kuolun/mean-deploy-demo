//引入mongoose
var mongoose = require('mongoose');

// 需填入user/pwd
var dbURI = process.env.DBURI;

//連到mlab
mongoose.connect(dbURI);

//monitor connect
mongoose.connection.on('connected', function() {

    console.log('Mongoose connected to ' + dbURI);
});

//monitor connection error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error  ' + err);
});