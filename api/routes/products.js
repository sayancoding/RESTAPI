const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product.model')

router.get("/",(req,res,next)=>{
  Product.find()
  .exec()
  .then(doc=>{
    if (doc) {
      console.log(doc)
      res.status(200).json(doc)
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

router.post('/', (req, res, next) => {

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    quantity: req.body.quantity
  });

  product
    .save()
    .then(doc => {
      console.log(doc)
      res.status(200).json(doc)
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
        console.log(doc)
        res.status(200).json(doc)
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


router.put('/:id', (req, res, next) => {
  res.status(200).send("products update")
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