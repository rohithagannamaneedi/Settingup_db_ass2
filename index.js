const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const User = require("./schema")
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users',async(req,res)=>{
  try{
      const {name,email,password} = req.body;
      if(!email || !name || !password){
        return  res.status(400).send({msg:"All field are required"});
      }
      const existingUser = await User.findOne({email});
      if(existingUser){
          return res.status(400).send({msg:"User already exisits"});
      }

      const data = new User({name,email,password});
      await data.save();
      return res.status(201).send({msg:"User created successfullyy.."});

      
  } catch (error) {
      return res.status(400).send({msg:"Something went wrong"})
  }

})

app.listen(port,async () => {
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database")
    console.log(`Example app listening at http://localhost:${port}`);

  }
  catch(error){
    console.log("Error connecting to database");
  }
  
});
