function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
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
        frame = video;
        canvas.getContext('2d').drawImage(frame, 0, 0);
        // Other browswers will fall back to image/png
        img.src = canvas.toDataURL('image/webp');
    };
} else {
    alert('getUserMedia() is not supported by your browser');
}
