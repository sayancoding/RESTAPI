const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const token = require('../auth-token')

const User = require('../models/user.model')

router.get('/', token ,(req, res) => {
  User.find()
    .select("email")
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          count: doc.length,
          user: doc.map(el => {
            return {
              _id: el.id,
              email: el.email
            }
          })
        }
        console.log(response)
        res.status(200).json(response)
      } else {
        res.status(404).json({
          message: "no valid one"
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err
      })
    })
})

router.post('/signup', (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(doc => {
      if (doc.length >= 1) {
        res.status(409).json({
          message: "email exiting.."
        })
      } else {
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
                  createdAccount: result
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
    .catch(err => {
      res.status(500).json({
        err: err
      })
    })
})

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      bcrypt.compare(req.body.password, user[0].pwd, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "auth failed , password doesn\'t match"
          })
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              id: user[0]._id
            },
            'secret',
            {
              expiresIn: "1h"
            }
          );
          res.header('auth-token',token).send(token);

          return res.status(201).json({
            message: "auth successful",
            token: token
          })
        }
        res.status(401).json({
          message: "auth failed , password doesn\'t match"
        })
      })

    })
    .catch(err => {
      res.status(404).json({
        err: err
      })
    })
})

router.delete("/:userId", (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: "remove account"
      })
    })
    .catch(err => {
      res.status(500).json({
        err: err
      })
    })
})

module.exports = router;