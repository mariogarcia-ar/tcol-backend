const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let creditSchema = new Schema({
    name:{ type: String},
    email:{ type: String},
    rollno:{ type: Number},
    photo: {type: String},
    ipfs: {type: String},
},{
    collection: 'credits'
});

module.exports = mongoose.model('Credit', creditSchema);
