let synth = window.speechSynthesis;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

document.body.onclick = function() {
    let text = "I am not happy";
    let utterance = new SpeechSynthesisUtterance(text);
    let voice = synth.getVoices().find(v => v.lang == 'en-GB');

    utterance.voice = voice;
    utterance.pitch = 1.0;
    utterance.rate = 0.6;
    synth.speak(utterance);
};

var startwrd = "blind";
var grammar = '#JSGF V1.0; grammar startwrd; public <startwrd> = ' + startwrd + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var word = event.results[last][0].transcript;
  console.log(word);
}

recognition.onnomatch = function(event) {
  console.log('I didnt recognise that color.');
}