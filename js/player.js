document.addEventListener("DOMContentLoaded", () => {
    const trackSelect = document.getElementById("trackSelect");
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const canvas = document.getElementById("visualizer");
    const canvasCtx = canvas.getContext("2d");
    const currentTrack = document.getElementById("current-track");
    const currentTime = document.getElementById("current-time");

    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let bufferLength;

    const initAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
    };

    const draw = () => {
        requestAnimationFrame(draw);
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = "#000";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    };

    draw();

    const updateCurrentTime = () => {
        const minutes = Math.floor(audioPlayer.currentTime / 60);
        const seconds = Math.floor(audioPlayer.currentTime % 60);
        currentTime.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const updateCurrentTrack = () => {
        currentTrack.textContent = trackSelect.options[trackSelect.selectedIndex].text;
    };

    const playTrack = (index) => {
        if (index >= 0 && index < trackSelect.options.length) {
            trackSelect.selectedIndex = index;
            audioSource.src = trackSelect.value;
            audioPlayer.load();
            audioPlayer.play();
            updateCurrentTrack();
        }
    };

    trackSelect.addEventListener("change", () => {
        playTrack(trackSelect.selectedIndex);
    });

    playBtn.addEventListener("click", () => {
        if (!audioContext) {
            initAudioContext();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        audioPlayer.play();
    });

    pauseBtn.addEventListener("click", () => audioPlayer.pause());

    stopBtn.addEventListener("click", () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    });

    nextBtn.addEventListener("click", () => {
        let nextIndex = trackSelect.selectedIndex + 1;
        if (nextIndex >= trackSelect.options.length) {
            nextIndex = 0;
        }
        playTrack(nextIndex);
    });

    prevBtn.addEventListener("click", () => {
        let prevIndex = trackSelect.selectedIndex - 1;
        if (prevIndex < 0) {
            prevIndex = trackSelect.options.length - 1;
        }
        playTrack(prevIndex);
    });

    audioPlayer.addEventListener("timeupdate", updateCurrentTime);

    audioPlayer.addEventListener("play", () => {
        if (!audioContext) {
            initAudioContext();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    });

    // Update current track information on page load
    updateCurrentTrack();
});
