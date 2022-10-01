let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

const {ipfsClient, urlSource, create} = require('ipfs-http-client');
const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

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
// console.log(req.file.path);
        const credit = new creditSchema({
            name: body.name,
            email: body.email,
            rollno: body.rollno,
            photo: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename,
            ipfs: 'vamos a meter el hash'
        });

        credit.save()
                .then( async savedCredit =>{
                    console.log('credit',credit, savedCredit, savedCredit._id);

                    // guardamos el ipfs
                    let client = create({url: process.env.IPFS_URL,headers:{authorization}});
                    const ipfs_file = await client.add(urlSource(credit.photo));
                    // console.log('ipfs_file', ipfs_file, "https://ipfs.io/ipfs/"+ipfs_file.cid);
                    savedCredit.ipfs = "https://ipfs.io/ipfs/"+ipfs_file.cid;
                    await savedCredit.save();

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