window.deviceDirection = {"rotX": 0, "rotY": 0};

let synth = window.speechSynthesis;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

// recognition.onresult = function(event) {
//   var last = event.results.length - 1;
//   var word = event.results[last][0].transcript;
//   console.log(word);
// }

// recognition.onnomatch = function(event) {
//   console.log('I didnt recognise that color.');
// }

function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
} else {
    console.log('Device Orientation API not supported.');
}

if (hasGetUserMedia()) {
    let mouseTimer;
    let sendInterval;

    // We're good to go!
    const vgaConstraints = {
        video: {
            width: {exact: 640},
            height: {exact: 480},
            facingMode: "environment"
        }
    };

    let frame;

    const video = document.querySelector('video');
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');

    navigator.mediaDevices.getUserMedia(vgaConstraints).
        then((stream) => {video.srcObject = stream});

    let getFeelings = function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browswers will fall back to image/png
        frame = canvas.toDataURL('image/webp');
        img.src = frame;

        canvas.toBlob(function(blob) {
            let fd = new FormData();
            fd.append('image', blob);
            $.ajax({
                type: "POST",
                url: "/feelings",
                data: fd,
                processData: false,
                contentType: false
            }).done(function(response) {
                console.log(response);
                let responses = response.split('|');
                responses.forEach((res, i) => {
                    let utterance = new SpeechSynthesisUtterance(res);
                    let voice = synth.getVoices().find(v => v.lang == 'en-AU');

                    utterance.voice = voice;
                    utterance.pitch = 1.0;
                    utterance.rate = 0.6;
                    synth.speak(utterance);
                });
            });
        }, 'image/webp');
    };

    let sendData = function() {
        console.log('Sending data');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browswers will fall back to image/png
        frame = canvas.toDataURL('image/webp');
        img.src = frame;
        dir = window.deviceDirection;

        console.log(Object.keys(dir));

        canvas.toBlob(function(blob) {
            let fd = new FormData();
            fd.append('image', blob);
            fd.append('rotX', dir.rotX);
            fd.append('rotY', dir.rotY);
            $.ajax({
                type: "POST",
                url: "/objAdd",
                data: fd,
                processData: false,
                contentType: false
            }).done(function(response) {
                console.log(response);
            });
        }, 'image/webp');
    };

    let askObject = function(text) {
        dir = window.deviceDirection;
        $.ajax({
                type: "POST",
                url: "/objOut",
                data: {"text": text.toLowerCase(), "rot": dir},
            });
    }

    let repeatSend = function() {
        sendData();
        sendInterval = setInterval(sendData, 3000);
    }

    let mouseDown = function() {
        mouseUp();
        mouseTimer = window.setTimeout(getFeelings, 1500); //set timeout to fire in 1.5 seconds when the user presses mouse button down
    }

    let mouseUp = function() {
        if (mouseTimer) window.clearTimeout(mouseTimer);  //cancel timer when mouse button is released
        if (sendInterval) clearInterval(sendInterval);
    }

    recognition.onresult = function(event) {
      var last = event.results.length - 1;
      var word = event.results[last][0].transcript;
      console.log(word);
      askObject(word);
    }

    document.body.onmousedown = mouseDown;
    document.body.onmouseup = mouseUp;
    document.body.ondblclick = repeatSend;
} else {
    alert('getUserMedia() is not supported by your browser');
}

function deviceOrientationHandler(eventData) {
    window.deviceDirection.rotX = 0; //eventData.alpha;
    window.deviceDirection.rotY = 0; //eventData.beta;
    $('#dir').text("Direction: " + eventData.alpha);
}
