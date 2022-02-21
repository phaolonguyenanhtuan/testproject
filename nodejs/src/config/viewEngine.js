import express from "express";
// var express = require('express');
let configWiewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine","ejs"); //jsp blade
    app.set("views","./src/views");

}

module.exports=configWiewEngine;
