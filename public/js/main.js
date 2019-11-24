window.deviceDirection = 0;

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

    let sendData = function(url, callback) {
        console.log('Sending data');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browswers will fall back to image/png
        frame = canvas.toDataURL('image/webp');
        img.src = frame;
        dir = window.deviceDirection;
        $('#dir').text("Direction: " + dir);

        canvas.toBlob(function(blob) {
            let fd = new FormData();
            fd.append('image', blob);
            fd.append('dir', dir);
            $.ajax({
                type: "POST",
                url: "/" + url,
                data: fd,
                processData: false,
                contentType: false
            }).done(function(response) {
                if (callback) callback(response);
            });
        }, 'image/webp');
    };

    let repeatSend = function() {
        sendData();
        sendInterval = setInterval(sendData, 3000);
    }

    let detectFaces = function() {
        sendData('feelings', function(response) {
            console.log(response);
            let responses = response.split('|');
            responses.forEach((res, i) => {
                let utterance = new SpeechSynthesisUtterance(res);
                let voice = synth.getVoices().find(v => v.lang == 'en-GB');

                utterance.voice = voice;
                utterance.pitch = 1.0;
                utterance.rate = 0.6;
                synth.speak(utterance);
            });
        });
    }

    let mouseDown = function() {
        mouseUp();
        mouseTimer = window.setTimeout(detectFaces, 1500); //set timeout to fire in 1.5 seconds when the user presses mouse button down
    }

    let mouseUp = function() {
        if (mouseTimer) window.clearTimeout(mouseTimer);  //cancel timer when mouse button is released
        if (sendInterval) clearInterval(sendInterval);
    }

    document.body.onmousedown = mouseDown;
    document.body.onmouseup = mouseUp;
    document.body.ondblclick = repeatSend;
} else {
    alert('getUserMedia() is not supported by your browser');
}

function deviceOrientationHandler(eventData) {
    window.deviceDirection = eventData.alpha;
    $('#dir').text("Direction: " + eventData.alpha);
}
