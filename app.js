const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 3000;

const products = require('./api/routes/products');

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


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//router are here..
// app.use(products)
app.use('/products',products);

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