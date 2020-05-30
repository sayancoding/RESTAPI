const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email:{type:String},
  pwd:{type:String},
})

module.exports = mongoose.model('User', userSchema);