import { FadeIn, FadeOut } from "Source/Scripts/fade.js";

const footImage = new Image("Source/Introduction/foot.png");
const bodyImage = new Image("Source/Introduction/body.png");
const headImage = new Image("Source/Introduction/head.png");
const face = new Image("Source/Introduction/face.png");

const fadeOut = new FadeOut("screen", 5, 255, false);
const facef = new FadeIn(face, 5, 255, false);

let cameraY = 0;
const totalHeight = footImage.height + bodyImage.height + headImage.height;

const intro = Sound.load("Source/Introduction/Intro.wav");
const gradual = Sound.load("Source/Introduction/gradual.ogg");

Sound.play(intro);

const startTime = Date.now();
let isFaceVisible = false;
let faceStartTime = null;
let stopAnimations = false;

Screen.display(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;

    footImage.draw(0, cameraY);

    if (cameraY > -footImage.height) {
        cameraY += 0.4;
    }

    bodyImage.draw(0, cameraY - bodyImage.height);
    headImage.draw(0, cameraY - bodyImage.height - headImage.height);

    if (elapsedTime >= 35 && !isFaceVisible) {
        isFaceVisible = true;
        faceStartTime = Date.now();
        facef.play(0, cameraY - bodyImage.height - 50 - headImage.height);
    }

    if (isFaceVisible) {
        facef.play(0, cameraY - bodyImage.height - 50 - headImage.height);
    }

    if (isFaceVisible && Date.now() - faceStartTime >= 3000) {
        stopAnimations = true;
    }

    if (stopAnimations) {
        Screen.clear()
        std.reload("Source/Scripts/title.js")
    }

    fadeOut.play();
});
