//include mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//create product schema
var schema = Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: String,
    price: Number,
    image: String
});



//export product model
module.exports = mongoose.model('Product', schema);