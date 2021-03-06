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
	console.log(out);
	objects.forEach(o => {
		if (o.name == stuff){
			out.push(o);
		};
	});
	return out;
}

function voiceOption(text, rot){
	var command = tAnalys.makeComm(text.toLowerCase());
    console.log(objects);
    console.log(command.com);
	switch(command.com){
		case "all":
		case "what":
			if (objects.length == 0){
				var result = `There are no objects here`;
			} else{
				var result = `I can see the following: `;
				var pos = [];
				objects.forEach(s => {
					//var rotX = rot.x - objects.rotX;
					//var rotY = rot.y - stuff.rotY;
					result += `${s.name} `;
				});
			};
			break;
		case "is":
			var stuff = getStuff(command.obj);
			if (command.obj != "all"){
					if (stuff.length != 0){
						var result = `There are ${command.obj}s here`;
					} else{
						var result = `There are no ${command.obj}s here`;
					};
				} else {
					var result = "I didnt quite catch that";
				};
			break;
		case "where":
			var stuff = getStuff(command.obj);
			if (command.obj != "all"){
				if (stuff.length == 0){
					var result = `There are no ${command.obj}s here`;
				} else{
					var result = `There is a `;
					console.log(stuff);
					var pos = [];
					stuff.forEach(s => {
						var rotX = rot.rotX - s.rotX; 
					//var rotY = rot.y - stuff.rotY;
						if (rotX < 0){
							result += `${s.name} at ${-1*Math.round(rotX)} degrees to the right`;
						} else {
							result += `${s.name} at ${Math.round(rotX)} degrees to the left`;
						};
					});
				};
			} else {
				var result = "I didnt quite catch that";
			};
			break;
		default:
			var result = "I didnt quite catch that";
	}
	console.log(result);
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
	console.log('Post response: ' + Object.keys(req.body.rot));
    let responseText = await voiceOption(req.body.text, req.body.rot);
    res.send(responseText);
};

//sending the image with post
exports.feelings =  async function(req, res) {
    let responseText = await person(req.file.buffer);
    console.log('Post response: ' + responseText);
    res.send(responseText);
};
