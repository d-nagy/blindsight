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

async function person(imgFile){
	var options = {"joy": "happy", "sorrow": "sad", "anger": "angry", "suprise": "suprised"};
	var feel = await vis.feelings(imgFile);
	const text = `The person is ${100*feel.confidence} percent ${options[feel.feeling]}`;
	console.log(text);
	return text;
}

async function test(){ 
	var text = await person("./faces.jpg");
	txtSp.txtToS(text);
}

test();