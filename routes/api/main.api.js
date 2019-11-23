"use strict";
const express = require('express');
const router = express.Router();

//sending the image with post
router.post('/process/', function(req, res){
    console.log(req.body);
    res.status(200).send("Thank you for testing.");
});
