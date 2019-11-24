//const stot = require("./speech_text.js");

const commands = ["in", "where", "what", "feeling", "thinking"];
const objects = ["person", "door", "table", "exit", "window"];

function segment(strin){
	var words = [];
	var word = "";
	for (var i=0; i<strin.length; i++){
		if (strin[i] != " "){
			word = word.concat(strin[i]);
		} else{
			words.push(word);
			var word = "";
		} 
	};
	words.push(word);
	return words;
}

function isin(array, element){
	for (var i=0; i<array.length; i++){
		if (array[i] == element){
			return true;
		};
	};
	return false;
}

function makeComm(strin){
	var segs = segment(strin);
	var command = "";
	var object = "";
	for (var i=0; i<segs.length; i++){
		if (isin(commands, segs[i])){
			command = segs[i];
		} else if (isin(objects, segs[i])){
			object = sege[i];
		};
	};
	if (command.length == 0){
		command = "all";
	};
	if (object.length == 0){
		object = "all";
	};
	return {com: command, obj: object};
}

module.exports.makeComm = makeComm;

//var out = makecomm("where are the doors");
//console.log(out);