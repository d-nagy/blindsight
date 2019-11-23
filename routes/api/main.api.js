"use strict";
const express = require('express');
const router = express.Router();


async function quickstart() {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    console.log("Reached");
    // Performs label detection on the image file
    // const [result] = await client.labelDetection('../doggos.jpg');
    // const labels = result.labelAnnotations;
    // console.log('Labels:');
    // labels.forEach(label => console.log(label));

    const [result] = await client.faceDetection('../people.jpg');
    const faces = result.faceAnnotations;
    console.log('Faces:');
    faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
    });
}
quickstart().catch(console.error);

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
router.post('/process/', function(req, res){
    console.log(req.body);
    let image_ID = req.body.ImageID;
    delete req.body.ImageID;
    if (req.files !== undefined && req.files.images !== undefined) {
        req.body.images = {};




    if (blog_ID !== "undefined") {
        Blog.findByIdAndUpdate(
            //Some unique identifier here
            blog_ID,

            //The data to be set
            req.body,

            //An option that asks mongoose to return the updated version
            //of the document instead of the pre-updated one
            { new: true },

            (err, blog) => {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.redirect('/admin/blog');
            }
        );
    } else {
        const newBlog = new Blog(req.body);
        newBlog.save(err => {
            if (err) {
                return res.status(500).send(err);
            }

            return res.status(200).redirect('/admin/blog');
        });
    }
});
