const vis = require("./compvis.js");
const tAnalys = require("./text_analysis.js");
const spTxt = require("./speech_text.js");
const txtSp = require("./text_speech");

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

async function addObj(fileName, rot){
	var out = await vis.object(fileName, rot);
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
	switch(command.com){
		var stuff = getStuff;
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

async function person(imgFile){
	var options = {"joy": "happy", "sorrow": "sad", "anger": "angry", "suprise": "suprised"};
	var feel = await vis.feelings(imgFile);
	const text = `The person is ${feel.confidence} percent ${options[feel.feeling]}`;
	console.log(text);
	return text;
}

async function test(){ 
	var text = await person("./faces.jpg");
	txtSp.txtToS(text);
}

voiceOption("hello world")
//test();