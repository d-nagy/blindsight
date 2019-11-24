"use strict";
const express = require('express');
const vis = require("./objRecognition.js");
const tAnalys = require("./textAnalysis.js");

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

function getStuff(stuff){
	var out = [];
	objects.forEach(o => {
		if (o.name == stuff){
			out.push(o.name);
		};
	});
	return out;
}

function voiceOption(text, rot){
	var command = tAnalys.makeComm(text);
    console.log(tAnalys.commands);
    var stuff = getStuff(command.name);
	switch(command.com){
		case "is":
			if (stuff.length != 0){
				var result = `There are ${command.obj} here`;
			};
			break;
		case "where":
			if (stuff.length == 0){
				var result = `There are no ${command.obj} here`;
			} else{
				var result = `There is a `;
				var pos = [];
				stuff.forEach(s => {
					var rotX = rot.x - stuff.rotX;
					//var rotY = rot.y - stuff.rotY;
					result += `${s.name} at ${rotX} degrees`;
				});
			};
			break;
		case "what":
			if (stuff.length == 0){
				var result = `There are no ${command.obj} here`;
			} else{
				var result = `There is a `;
				var pos = [];
				stuff.forEach(s => {
					var rotX = rot.x - stuff.rotX;
					//var rotY = rot.y - stuff.rotY;
					result += `${s.name}, and a`;
				});
			};
			break;

	}
	return result;
}

async function person(imageBuffer){
	var options = {"joy": "happy", "sorrow": "sad", "anger": "angry", "surprise": "suprised", "neutral": "neutral"};
    var feels = await vis.feelings(imageBuffer);

    let texts = [];
    feels.forEach((feel, i) => {
        texts.push(`Person ${i+1} is ${feel.confidence} percent likely to be ${options[feel.feeling]}`);
    });

    let text = texts.join('|');
	console.log(text);
	return text;
}


exports.objAdd =  async function(req, res) {
    console.log("objAdd hit");
    console.log(req.body.rotX + " " + req.body.rotY);
    await addObj(req.file.buffer, {'rotX': req.body.rotX, 'rotY': req.body.rotY});
    res.send('Object added.');
};

exports.objOut =  async function(req, res) {
    let responseText = await voiceOption(req.body.text, req.body.rot);
    console.log('Post response: ' + responseText);
    res.send(responseText);
};

//sending the image with post
exports.feelings =  async function(req, res) {
    let responseText = await person(req.file.buffer);
    console.log('Post response: ' + responseText);
    res.send(responseText);
};
