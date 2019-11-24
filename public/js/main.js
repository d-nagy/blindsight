function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
    // We're good to go!
    const vgaConstraints = {
        video: {width: {exact: 640}, height: {exact: 480}}
    };

    const audioConstraints = {
        audio: true
    };

    let frame;

    const video = document.querySelector('video');
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();

    navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => {
        video.srcObject = stream;
    });

    video.onmousedown = function () {
        context.resume();
        navigator.mediaDevices.getUserMedia(audioConstraints).then((stream) => {
            // video.srcObject = stream;
            const microphone = context.createMediaStreamSource(stream);
            const filter = context.createBiquadFilter();
            // const processor = context.createScriptProcessor(1024, 1, 1);
            // microphone -> filter -> destination
            microphone.connect(filter);
            filter.connect(context.destination);
            // microphone.connect(processor);
            // processor.connect(context.destination);
            // const recordedChunks = [];

            // processor.onaudioprocess = function (e) {
                // Do something with the data, e.g. convert it to WAV
                // const mediaRecorder = new MediaRecorder(stream, options);
                // console.log(e.inputBuffer);
                // mediaRecorder.addEventListener('dataavailable', function(e) {
                // if (e.data.size > 0) {
                //     recordedChunks.push(e.data);
                // }
                // });
            // };
            // console.log(recordedChunks);

        });
    };

    video.onmouseup = function () {
        context.suspend();
        console.log("Is the stream active?");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        // Other browswers will fall back to image/png
        frame = canvas.toDataURL('image/webp');
        img.src = frame;

        canvas.toBlob(function (blob) {
            let fd = new FormData();
            fd.append('image', blob);
            $.ajax({
                type: "POST",
                url: "/process/",
                data: fd,
                processData: false,
                contentType: false
            }).done(function (response) {
                console.log(response);
            });
        }, 'image/webp');
    };

} else {
    alert('getUserMedia() is not supported by your browser');
}
