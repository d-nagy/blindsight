let synth = window.speechSynthesis;

document.body.onclick = function() {
    let text = "I am not happy";
    let utterance = new SpeechSynthesisUtterance(text);
    let voice = synth.getVoices().find(v => v.lang == 'en-GB');

    utterance.voice = voice;
    utterance.pitch = 1.0;
    utterance.rate = 0.6;
    synth.speak(utterance);
};
