const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');


async function txtToS(text) {
  const client = new textToSpeech.TextToSpeechClient();

  const request = {
    input: {text: text},
    voice: {languageCode: 'en-AU', ssmlGender: 'MALE'},
    audioConfig: {audioEncoding: 'LINEAR16'},
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.WAV', response.audioContent, 'binary');
  console.log('Audio content written to file: output.WAV');
}

module.exports.txtToS = txtToS;
//main()