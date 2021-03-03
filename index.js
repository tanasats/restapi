const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");


dotenv.config();

//Connect to DB
  //console.log(process.env.DB_CONNECT);
  //mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(
    ()=>{
        console.log("DB connected")
    },
    error =>{
        console.log("error:"+error)
    }
);

//Middleware
//app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server Up and running..."));
