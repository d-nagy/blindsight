const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

function getAngle(x, y, rotX, rotY){
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

async function findObjects(imageBuffer, rot) {
	console.log(1);
	// const request = {
  	// 	image: {content: fs.readFileSync(fileName)},
	// };
	const [result] = await client.objectLocalization(imageBuffer);
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
		const angle = getAngle(centreVert[0], centreVert[1], rot.rotX, rot.rotY);
		out.push({rotX: angle.angX, rotY: angle.angY, name: object.name});
	});
	return out;
}

async function feelings(fileName){
	//const client = new vision.ImageAnnotatorClient();
	const probs = {"VERY_UNLIKELY": 0, "UNLIKELY": 25, "POSSIBLE": 50, "LIKELY": 75, "VERY_LIKELY": 100}
	const [result] = await client.faceDetection(fileName);
    const faces = result.faceAnnotations;

    let outputs = [];

    faces.forEach((face, i) => {
        console.log("face.joylikelihood: " + face.joyLikelihood);
        console.log("face.angerlikelihood: " + face.angerLikelihood);
        console.log("face.sorrowlikelihood: " + face.sorrowLikelihood);
        console.log("face.surpriselikelihood: " + face.surpriseLikelihood);

        var maxfeeling = probs[face.joyLikelihood];
        //console.log(face.joyLikelihood);
        var feel = "joy";
        if (probs[face.angerLikelihood] > maxfeeling){
            maxfeeling = probs[face.angerLikelihood];
            feel = "anger";
        };
        if (probs[face.sorrowLikelihood] > maxfeeling){
            maxfeeling = probs[face.sorrowLikelihood];
            feel = "sorrow";
        };
        if (probs[face.surpriseLikelihood] > maxfeeling){
            maxfeeling = probs[face.surpriseLikelihood];
            feel = "surprise";
        };

        outputs.push({feeling: feel, confidence: maxfeeling});
    });

	return outputs;
}

module.exports.findObjects = findObjects;
module.exports.feelings = feelings;
module.exports.getAngle = getAngle;
