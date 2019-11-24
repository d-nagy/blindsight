const speech = require('@google-cloud/speech');
const fs = require('fs');

async function sToTxt(fileName) {
  const client = new speech.SpeechClient();
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
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

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript).join();
  console.log(`Transcription: ${transcription}`);

  return transcription;
}

async function test(){
    var out = await sToTxt("./output.WAV");
    console.log(out);
}

module.exports.sToTxt = sToTxt;

//test().catch(console.error);