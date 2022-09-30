const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let creditSchema = new Schema({
    name:{ type: String},
    email:{ type: String},
    rollno:{ type: Number},
},{
    collection: 'credits'
});

module.exports = mongoose.model('Credit', creditSchema);
