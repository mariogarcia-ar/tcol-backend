require('dotenv').config()

let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
const path = require('path');
const creditRoute = require("./routes/credit.route");



mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Database Successfully connected!");
}, error =>{
    console.log("Colud not connect to dababase"+error);
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));
app.use('/credits', creditRoute);

// port
const port = process.env.PORT || 4000;
const server = app.listen(port, ()=>{
    console.log('Connected to port '+port)
});

// 404
app.use((req, res, next)=>{
    res.status(404).send('Error 404')
});

// 500
app.use(function(err, req, res, next){
    console.log(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})

