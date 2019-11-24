// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');
const fs = require('fs');

const client = new vision.ImageAnnotatorClient();

async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

function get_angle(x, y, rotX, rotY){
	const angWidth = 60;
	const angHeight = 60;
	const xSize = 640;
	const ySize = 480;

	angFromTop = angHeight * y/ySize;
	angFromLeft = angWidth * x/ySize;
	angY = angFromTop + angHeight/2 + rotY;
	angX = angFromLeft + angWidth/2 + rotX;
	return	{angX, angY};	
}

// Creates a client

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

async function object(fileName, rot) {
	console.log(1);
	const request = {
  		image: {content: fs.readFileSync(fileName)},
	};
	const [result] = await client.objectLocalization(request);
	const objects = result.localizedObjectAnnotations;
	var out = [];
	objects.forEach(object => {
		const vertices = object.boundingPoly.normalizedVertices;
		var centreVert = [0, 0];
  		vertices.forEach(v => {
  			centreVert[0] += v.x;
  			centreVert[1] += v.y;
  		});
  		centreVert[0] = centreVert[0]/4;
  		centreVert[1] = centreVert[1]/4;
		const angle = get_angle(centreVert[0], centreVert[1], rot.x, rot.y);
		out.push({rotX: angle.angX, rotY: angle.angY, name: object.name});
	});
	return out;
}


async function feelings(fileName){
	//const client = new vision.ImageAnnotatorClient();
	const probs = {"VERY_UNLIKELY": 0, "UNLIKELY": 25, "POSSIBLE": 50, "LIKLEY": 75, "VERY_LIKLEY": 100}
	const [result] = await client.faceDetection(fileName);
	const faces = result.faceAnnotations;
	//console.log(faces);
	face = faces[0];
	var maxfeeling = probs[face.joyLikelihood];
	//console.log(face.joyLikelihood);
	var feel = "joy";
	if (probs[face.joyLikelihood] > maxfeeling){
		maxfeeling = probs[face.joyLikelihood];
		feel = "anger";
	};
	if (probs[face.joyLikelihood] > maxfeeling){
		maxfeeling = probs[face.joyLikelihood];
		feel = "sorrow";
	};
	if (probs[face.joyLikelihood] > maxfeeling){
		maxfeeling = probs[face.joyLikelihood];
		feel = "suprise";
	};
	/*
	faces.forEach((face, i) => {
  		console.log(`  Face #${i + 1}:`);
  		console.log(`    Joy: ${face.joyLikelihood}`);
  		console.log(`    Anger: ${face.angerLikelihood}`);
  		console.log(`    Sorrow: ${face.sorrowLikelihood}`);
  		console.log(`    Surprise: ${face.surpriseLikelihood}`);
	});
	*/
	var out = {feeling: feel, confidence: maxfeeling};
	return out;
}


async function output(){
	const obj = await object('./dog.jpg', {x:0, y:0});
	console.log(obj);
}

//output();

module.exports.object = object;
module.exports.feelings = feelings;

/*
obj.forEach(obj => {
	console.log(`Name: ${obj.name}`);
	console.log(`Confidence: ${obj.score}`);
	const vertices = obj.boundingPoly.normalizedVertices;
	vertices.forEach(v => console.log(`x: ${v.x}, y: ${v.y}`));
});
*/

