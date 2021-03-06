const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const multer = require('multer')
const token = require('../auth-token')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString()+'_'+file.originalname)
  }
})

//file-filter func
const fileFilter = (req, file, cb)=>{
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

const upload = multer({ 
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter:fileFilter
})

const Product = require('../models/product.model')

router.get("/", (req,res,next)=>{
  Product.find()
  .select('name price category quantity _id')
  .exec()
  .then(doc=>{
    if (doc) {
      const response = {
        count: doc.length,
        products:doc.map(el=>{
          return{
            _id:el.id,
            name:el.name,
            price:el.price,
            category:el.category,
            request:{
              type:'GET',
              url:`http://localhost:4000/products/${el._id}`
            }
          }
        })
      }
      console.log(doc)
      res.status(200).json(response)
    } else {
      res.status(404).json({
        message: "No valid entry by id"
      })
    }
  })
  .catch(err=>{
    console.log("Get an error..")
    res.status(500).json(err)
  })
})

router.post('/', upload.single('productImage'),(req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    productImage:req.file.path
  });

  product
    .save()
    .then(doc => {
      const createdData = {
        _id:doc._id,
        name:doc.name,
        price:doc.price,
        category:doc.category,
        productImage:doc.productImage,
        request:{
          type:'GET',
          url: `http://localhost:4000/products/${doc._id}`
        }
      }
      console.log(createdData)
      res.status(200).json(createdData)
    })
    .catch(err => {
      console.log("Get an error on posting..")
      res.status(500).json({
        message:err
      })
    })
})

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .exec()
    .then(doc => {
      if(doc){
        const response = {
              _id: doc.id,
              name: doc.name,
              price: doc.price,
              category: doc.category,
              productImage:doc.productImage,
              request: {
                type: 'GET',
                url: `http://localhost:4000/products/${doc._id}`
              }
        }
        console.log(doc)
        res.status(200).json(response)
      }else{
        res.status(404).json({
          message: "No valid doc by this id"
        })
      }
    })
    .catch(err => {
      console.log("Get an error..")
      res.status(500).json({
        err: err
      })
    })
})


router.patch('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateOp = {}
  for(const op of req.body){
    updateOp[op.propName] = op.value 
  }
  Product.update({_id:id},{$set:updateOp})
  .exec()
  .then(doc=>{
    res.status(200).json(doc)
    console.log("Updated..");
  })
  .catch(err=>{
    res.status(500).json({
      msg:err
    })
  })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Product.remove({_id:id})
  .exec()
  .then(msg=>{
    console.log("doc deleted..")
    res.status(200).json(msg)
  })
  .catch(err=>{
    console.log("Get an error..")
    res.status(500).json(err)
  })
})

module.exports = router;