const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 3000;

const products = require('./api/routes/products');
const orders = require('./api/routes/orders');
const users = require('./api/routes/users')

mongoose
  .connect(
    "mongodb+srv://cluster0-nw34s.mongodb.net/test?retryWrites=true&w=majority",
    {
      dbName: "Restapi",
      user: "sayan",
      pass: "restapi",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(()=>{
    console.log(`mongo connected..`)
  }
  );

  mongoose.Promise = global.Promise;

app.use('/upload/',express.static('upload'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//router are here..
// app.use(products)
app.use('/products',products);
app.use('/orders',orders);
app.use('/user',users);

//error handel
app.use((req,res,next)=>{
  const error = new Error('Not found')
  error.status = 404
  next(error);
})
app.use((error,req,res,next)=>{
  res.status(error.status || 500)
  res.json({
    error:{
      message:error.message
    }
  })
})

app.listen(PORT,_=>{
  console.log(`local server is running at ${PORT}`)
})
