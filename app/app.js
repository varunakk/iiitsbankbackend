const express =require("express");
const mongoose=require("mongoose");
const app=express();
require('dotenv').config()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const path=require('path')
const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })
const { MongoClient, ServerApiVersion } = require('mongodb');

const fsr = require('file-stream-rotator');
//url defines the location of the database that we are creating in localhost
const url="mongodb://localhost/bank";
mongoose.connect(
  "mongodb+srv://vikram:vikram123@cluster0.uszdr.mongodb.net/Bank?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);  
const con=mongoose.connection;
con.on('open',()=>{
  console.log("connected");
});

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

//.on is used to trigger a event 
var cors = require('cors')
app.use(cors())

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

var morgan = require('morgan')
morgan.token('host', function(req, res){
    return req.hostname;
})
morgan.token("wbdaccess", "User trying to access the :url");
let logsinfo = fsr.getStream({filename:"test.log", frequency:"1h", verbose: true});
app.use(morgan('wbdaccess', {stream: logsinfo}))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './../src/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname+".jpg")
    }
  })
   
  var upload = multer({ storage: storage })

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    console.log(file)
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    //  res.send(file)
    res.redirect("http://localhost:3000/Admin/");
  })

app.use(express.json())
const tran=require("./routers/trans");
app.use("/transactions",tran);

const req=require("./routers/req");
app.use("/req",req);

const loan=require("./routers/loan");
app.use("/loan",loan);


const user=require("./routers/users");
app.use("/users",user);
app.listen(process.env.PORT||5000,()=>{

    console.log("server started");
});

