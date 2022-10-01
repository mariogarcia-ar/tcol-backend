let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

let creditSchema = require("../models/Credit");

router.route("/create-credit")
    .post(upload.single("photo"), (req, res) =>{
        const body = req.body;

        const credit = new creditSchema({
            name: body.name,
            email: body.email,
            rollno: body.rollno,
            photo: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename,
        });

        credit.save()
                .then((savedCredit)=>{
                    res.json(savedCredit);
                })
                .catch((err)=>{
                    console.log(err.message)
                })
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
        .put(upload.single("photo"), (req, res, next)=>{
            const body = req.body;

            const data = {
                name: body.name,
                email: body.email,
                rollno: body.rollno,
            };

            if (req.file){
                data.photo = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
            }
            
            // creditSchema.findByIdAndUpdate(req.params.id, {$set: req.body},(error,data)=>{
            creditSchema.findByIdAndUpdate(req.params.id, data,(error,data)=>{
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