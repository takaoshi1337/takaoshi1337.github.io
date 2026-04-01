const timings = {
    start: performance.now(),
    images: 0,
    scripts: 0,
    track: 0
};

window.addEventListener("load", () => {
    timings.images = performance.now();
    console.log(`loaded images in ${Math.round(timings.images - timings.start)} ms`);
});

document.addEventListener("DOMContentLoaded", () => {
    timings.scripts = performance.now();
    console.log(`loaded scripts in ${Math.round(timings.scripts - timings.start)} ms`);
});

const audio = document.querySelector("audio");

if (audio) {
    audio.addEventListener("canplaythrough", () => {
        timings.track = performance.now();
        console.log(`loaded track in ${Math.round(timings.track - timings.start)} ms`);
    });
}

window.onload = () => {
    console.log("everything fully loaded");
};