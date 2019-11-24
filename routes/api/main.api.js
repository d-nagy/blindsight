"use strict";
const express = require('express');
const vis = require("./objRecognition.js");

var objects = [];

function isObj(element){
	const tol = 5;
	for (var i=0; i<objects.length; i++){
		if (objects[i].name == element.name){
			if (Math.pow(objects[i].rotX - element.rotX, 2) < Math.pow(tol, 2)){
				if (Math.pow(objects[i].rotY - element.rotY, 2) < Math.pow(tol, 2)){
					return true;
				};
			};
		};
	};
	return false;
}

async function addObj(imageBuffer, rot){
	var out = await vis.findObjects(imageBuffer, rot);
	out.forEach(o => {
		if (!isObj(o)){
			objects.push(o);
		};
	});
}

async function person(imageBuffer){
	var options = {"joy": "happy", "sorrow": "sad", "anger": "angry", "surprise": "suprised"};
    var feels = await vis.feelings(imageBuffer);

    let texts = [];
    feels.forEach((feel, i) => {
        texts.push(`Person ${i+1} is ${feel.confidence} percent ${options[feel.feeling]}`);
    });

    let text = texts.join('|');
	console.log(text);
	return text;
}


//sending the image with post
exports.feelings =  async function(req, res) {
    let responseText = await person(req.file.buffer);
    console.log('Post response: ' + responseText);
    res.send(responseText);
};
