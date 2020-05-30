const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user.model')

router.get('/',(req,res)=>{
  User.find()
  .select("email")
  .exec()
  .then(doc=>{
    if(doc){
      const response = {
        count:doc.length,
        user:doc.map(el=>{
          return{
            _id:el.id,
            email:el.email
          }
        })
      }
      console.log(response)
      res.status(200).json(response)
    }else{
      res.status(404).json({
        message:"no valid one"
      })
    }
  })
  .catch(err=>{
    res.status(500).json({
      err:err
    })
  })
})

router.post('/signup',(req,res)=>{
  User.find({email:req.body.email})
  .exec()
  .then(doc=>{
    if(doc.length >= 1){
      res.status(409).json({
        message : "email exiting.."
      })
    }else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log("error is hashing..")
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            pwd: hash
          })
          user
            .save()
            .then(result => {
              console.log(result)
              res.status(201).json({
                message: "user created",
                createdAccount:result
              })
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                err: err
              })
            })
        }
      })
    }
  })
  .catch(err=>{
    res.status(500).json({
      err:err
    })
  })
})

router.delete("/:userId",(req,res)=>{
  User.remove({_id:req.params.userId})
  .exec()
  .then(result=>{
    console.log(result)
    res.status(200).json({
      message:"remove account"
    })
  })
  .catch(err=>{
    res.status(500).json({
      err:err
    })
  })
})

module.exports = router;