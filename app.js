
/**
 * Module dependencies.
 */

// require('dotenv').config()
var express = require('express')
  , favicon = require('serve-favicon')
  , bodyParser = require('body-parser')
  , errorHandler = require('errorhandler')
  , morgan = require('morgan')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , sass = require('node-sass-middleware');

var app = express();

app.engine('pug', require('pug').__express);

app.use(sass({
    src: __dirname,
    dest: path.join(__dirname, 'public/'),
    debug: true,
    outputStyle: 'compressed'
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
//app.use(express.favicon());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

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

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
