window.deviceDirection = 0;

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
    // We're good to go!
    const vgaConstraints = {
        video: {width: {exact: 640}, height: {exact: 480}}
    };

    let frame;

    const video = document.querySelector('video');
    const img = document.querySelector('img');
    const canvas = document.createElement('canvas');

    navigator.mediaDevices.getUserMedia(vgaConstraints).
        then((stream) => {video.srcObject = stream});

    video.onclick = function() {
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
                url: "/process/",
                data: fd,
                processData: false,
                contentType: false
            }).done(function(response) {
                console.log(response);
            });
        }, 'image/webp');
    };

} else {
    alert('getUserMedia() is not supported by your browser');
}

function deviceOrientationHandler(eventData) {
    window.deviceDirection = eventData.alpha;
    $('#dir').text("Direction: " + eventData.alpha);
}
