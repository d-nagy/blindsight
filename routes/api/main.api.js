"use strict";
const express = require('express');

async function detectLabels(imageBuffer) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    // Performs label detection on the image file
    console.log(imageBuffer);
    const [labelsResult] = await client.labelDetection(imageBuffer);
    const labels = labelsResult.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label));

    const [facesResult] = await client.faceDetection(imageBuffer);
    const faces = facesResult.faceAnnotations;
    console.log('Faces:');
    faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
}

async function where(fileName) {
    const request = {
        image: {content: fs.readFileSync(fileName)},
    };
    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    objects.forEach(object => {
        console.log(`Name: ${object.name}`);
        console.log(`Confidence: ${object.score}`);
        const vertices = object.boundingPoly.normalizedVertices;
        vertices.forEach(v => console.log(`x: ${v.x}, y:${v.y}`));
    });
    return objects;
}

async function output(){
    const obj = await where('./dog.png');
    console.log(obj[0].score);
}

//sending the image with post
exports.process =  function(req, res) {
    console.log('Output!');

    detectLabels(req.file.buffer);

    res.send('output');
};
