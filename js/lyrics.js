import { track } from './tracks.js';

export function parseLRC(lrc) {
    const lines = lrc.trim().split('\n');
    const result = [];
    const timeReg = /\[(\d+):(\d+\.\d+)\]/;

    lines.forEach(line => {
        const match = timeReg.exec(line);
        if (match) {
            result.push({ 
                time: parseInt(match[1]) * 60 + parseFloat(match[2]), 
                text: line.replace(timeReg, '').trim() 
            });
        }
    });

    return result;
}

function initLyrics() {
    const lyricElement = document.getElementById('current-lyric');
    if (!lyricElement || !window.audioPlayer) return;

    const lyrics = parseLRC(track);

    if (lyrics.length > 0) {
        lyricElement.innerText = lyrics[0].text;
    }

    window.audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = window.audioPlayer.currentTime + 0.1;

        const active = lyrics.reduce((prev, curr) => 
            (curr.time <= currentTime ? curr : prev), 
            lyrics[0]
        );

        if (active && lyricElement.innerText !== active.text) {
            lyricElement.style.opacity = 0;
            lyricElement.style.transform = 'translateY(5px)';

            setTimeout(() => {
                lyricElement.innerText = active.text;
                lyricElement.style.opacity = 1;
                lyricElement.style.transform = 'translateY(0)';
            }, 100);
        }
    });
}

document.addEventListener('DOMContentLoaded', initLyrics);