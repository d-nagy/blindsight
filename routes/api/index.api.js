"use strict";
const express = require('express');
const router = express.Router();

//sending the image with post
router.post('/contact/', function(req, res){

    res.status(200).send("Thank you for contacting us at Fruitful Durham.");
});
