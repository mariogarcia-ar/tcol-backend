let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

let creditSchema = require("../models/Credit");

router.post( "/create-credit", (req, res, next) =>{
    creditSchema.create(req.body, (error, data) =>{
        if(error){
            return next(error);
        }else{
            console.log(data);
            res.json(data);
        }
    });
});

router.get( "/", (req, res, next) =>{
    creditSchema.find((error, data) =>{
        if(error){
            return next(error);
        }else{
            res.json(data);
        }
    });
});

router
    .route("/update-credit/:id")
        .get((req, res, next)=>{
            creditSchema.findById(req.params.id, (error,data)=>{
                if(error){
                    return next(error);
                }else{
                    res.json(data);
                }
            })
        })
        .put((req, res, next)=>{
            creditSchema.findByIdAndUpdate(req.params.id, {$set: req.body},(error,data)=>{
                if(error){
                    console.log(error);
                    return next(error);
                }else{
                    res.json(data);
                    console.log("Credit updated succesfully!");
                }
            })
        });

router.delete("/delete-credit/:id",(req, res, next)=>{
    creditSchema.findByIdAndRemove(req.params.id, (error,data)=>{
        if(error){
            console.log(error);
            return next(error);
        }else{
            res.status(200).json({
                msg: data,
            }); 
        }
    });    
});      

module.exports = router; 