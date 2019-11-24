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

function makecomm(strin){
	var segs = segment(strin);
	var com = "";
	var obj = "";
	for (var i=0; i<segs.length; i++){
		if (isin(commands, segs[i])){
			com = segs[i];
		} else if (isin(objects, segs[i])){
			obj = sege[i];
		};
	};
	if (com.length == 0){
		com = "all";
	};
	if (obj.length == 0){
		obj = "all";
	};
	return [com, obj];
}

var out = makecomm("where are the doors");
console.log(out);