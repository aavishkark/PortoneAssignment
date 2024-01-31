const express=require('express')
const cors=require('cors')
const stripe = require('stripe')("sk_test_51OebiVSEq04GdtyFQNZJQQ00egKAJOIkrVk5NBqdaChdAwBRlEh3N2GrdlBH9FuyyA9xOEw08auwMxz2xl1U0Dz500W0ilJ2UV");

require("dotenv").config()
const port = process.env.PORT
const app=express()
app.use(cors())
app.use(express.json())

//Home Page
app.get('/',(req,res)=>{
    res.status(200).send({"msg":"This is the home page for stripe payment app"})
})



//Creating Intent
  app.post('/api/v1/create_intent', async(req, res) => {
    let amount=req.body.amount;
    let currency=req.body.currency;
    let paymentMethodId=req.body.pay_method
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method: paymentMethodId
      });
      res.status(200).send({ msg: paymentIntent });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });



  //Capturing Intent
  app.post('/api/v1/capture_intent/:id', async(req, res) => {
    try {
      const payment_id = req.params.id
      const paymentIntent = await stripe.paymentIntents.capture(payment_id);
      res.status(200).send({ msg: paymentIntent });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });



  //Refund
  app.post('/api/v1/create_refund/:id', async(req, res) => {
    try {
      const payment_id = req.params.id;
      const paymentIntent = await stripe.refunds.create({
        payment_intent: payment_id,
      });
      res.status(200).send({ msg: paymentIntent });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });



  //Getting Intents List
  app.get('/api/v1/get_intents', async(req, res) => {
    try {
      const intents = await stripe.paymentIntents.list();
      res.status(200).send({ msg: intents });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });



app.listen(port,async()=>{
    console.log(`App running on port ${port}`)
})