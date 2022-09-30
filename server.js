let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let bodyParser = require("body-parser");
let dbConfig = require("./database/db");

const creditRoute = require("./routes/credit.route");

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(()=>{
    console.log("Database Successfully connected!");
}, error =>{
    console.log("Colud not connect to dababase"+error);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({    extended: true }));
app.use(cors());
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

