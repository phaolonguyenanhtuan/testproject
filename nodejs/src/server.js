import express from "express";
import bodyParser from "body-parser"; //param query
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';
require('dotenv').config();


let app = express();


 
 
   

app.use(cors({origin:true}));  
    
//app.use(cors({ origin: "http://localhost:3000", credentials: true }))

//config app

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb',extended : true}));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port=process.env.Port || 6969;
//port===undefine =>port=6969
app.listen(port,() => {
   // console.log("backend nodejs is runing",+port);
   console.log(`backend nodejs is runing:${port}`);

})