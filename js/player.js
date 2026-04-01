const player = window.audioPlayer = document.getElementById('track');
const [toggleBtn, volSlider, volText, progSlider, currText, durText] = 
    ['toggleBtn', 'volume', 'volValue', 'progress', 'currentTime', 'durationTime']
    .map(id => document.getElementById(id));

const format = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
const audioEl = document.getElementById('track');
const coverImg = document.querySelector('.music img');

let audioCtx, analyser, source, dataArray;

player.ontimeupdate = () => {
    if (player.duration) {
        progSlider.value = (player.currentTime / player.duration) * 100;
        currText.textContent = format(player.currentTime);
        durText.textContent = format(player.duration);
    }
};

progSlider.oninput = () => player.currentTime = (progSlider.value / 100) * player.duration;
player.onloadedmetadata = () => durText.textContent = format(player.duration);
player.volume = volSlider.value;

toggleBtn.onclick = () => {
    const isPaused = player.paused;
    player[isPaused ? 'play' : 'pause']();
    toggleBtn.textContent = isPaused ? 'PAUSE' : 'PLAY';
};

player.onended = () => toggleBtn.textContent = 'PLAY';

volSlider.oninput = (e) => {
    player.volume = e.target.value;
    volText.textContent = Math.round(e.target.value * 100) + '%';
};

function getAlbumColor(imgEl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 10;
    try {
        ctx.drawImage(imgEl, 0, 0, 10, 10);
        const pixels = ctx.getImageData(0, 0, 10, 10).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
            if (brightness < 20 || brightness > 235) continue;
            r += pixels[i];
            g += pixels[i+1];
            b += pixels[i+2];
            count++;
        }
        if (count === 0) return '255,255,255';
        return `${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)}`;
    } catch {
        return '255,255,255';
    }
}

let glowColor = '255,255,255';

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source = audioCtx.createMediaElementSource(audioEl);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    if (coverImg.complete) {
        glowColor = getAlbumColor(coverImg);
    } else {
        coverImg.onload = () => { glowColor = getAlbumColor(coverImg); };
    }
    pulseCover();
}

function pulseCover() {
    requestAnimationFrame(pulseCover);
    analyser.getByteFrequencyData(dataArray);
    const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    const intensity = bass / 255;
    const glowSize = Math.round(intensity * 50);
    const glowOpacity = (0.2 + intensity * 0.8).toFixed(2);
    coverImg.style.boxShadow = `
        0 0 ${glowSize}px rgba(${glowColor}, ${glowOpacity}),
        0 0 ${glowSize * 2}px rgba(${glowColor}, ${(glowOpacity * 0.5).toFixed(2)})
    `;
}

document.getElementById('toggleBtn').addEventListener('click', initAudio, { once: true });