const express=require("express");
const router=express.Router();
const usercoll=require("../models/users");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://vikram:vikram123@cluster0.uszdr.mongodb.net/Bank?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.info('Connection to Database is successful'));
async function register(){
 
}

router.patch("/:from/:to", async (req, res) =>{
   const fobj=req.body.from;
   const tobj=req.body.to;
   
const session = await mongoose.startSession();

session.startTransaction();

       try {
           console.log("1");
    
            const user = await usercoll.findOne({ acc:req.params.from});
            console.log(user)

            user.balance = 900000,
            user.mail="varuna@gmail.com"
            user.markModified('balance');
            user.markModified('mail');
    
            const updatedStudent = await user.save({ session: session })

         console.log(user)
         res.json(200)
                
    await session.commitTransaction();

       } catch (error) {
    await session.abortTransaction();
    res.json(500)
        console.log(error);
    }finally{
session.endSession();
}

})
module.exports=router;