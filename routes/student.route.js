let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

let studentSchema = require("../models/Student");

router.post( "/create-student", (req, res, next) =>{
    studentSchema.create(req.body, (error, data) =>{
        if(error){
            return next(error);
        }else{
            console.log(data);
            res.json(data);
        }
    });
});

router.get( "/", (req, res, next) =>{
    studentSchema.find((error, data) =>{
        if(error){
            return next(error);
        }else{
            res.json(data);
        }
    });
});

router
    .route("/update-student/:id")
        .get((req, res, next)=>{
            studentSchema.findById(req.params.id, (error,data)=>{
                if(error){
                    return next(error);
                }else{
                    res.json(data);
                }
            })
        })
        .put((req, res, next)=>{
            studentSchema.findByIdAndUpdate(req.params.id, {$set: req.body},(error,data)=>{
                if(error){
                    console.log(error);
                    return next(error);
                }else{
                    res.json(data);
                    console.log("Student updated succesfully!");
                }
            })
        });

router.delete("/delete-student/:id",(req, res, next)=>{
    studentSchema.findByIdAndRemove(req.params.id, (error,data)=>{
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