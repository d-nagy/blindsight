"use strict";
const express = require('express');
const speech = require('@google-cloud/speech');
const vision = require('@google-cloud/vision');


async function detectLabels(imageBuffer) {
    // Imports the Google Cloud client library

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

async function speaking(){
    // Creates a client
    const client = new speech.SpeechClient();

    // The name of the audio file to transcribe
    const fileName = './output.wav';

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 24000,
        languageCode: 'en-AU',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(response);
    console.log(`Transcription: ${transcription}`);
}


//sending the image with post
exports.process =  function(req, res) {
    console.log('Output!');

    detectLabels(req.file.buffer);

    res.send('output');
};
