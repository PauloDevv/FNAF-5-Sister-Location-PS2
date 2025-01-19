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



const startTime = Date.now();
let isFaceVisible = false;
let faceStartTime = null;
let stopAnimations = false;
let blackScreenStartTime = null;
let isBlackScreen = false;

Sound.play(intro);

const gradual = Sound.load("Source/Introduction/gradual.wav");

Screen.display(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;

    
    if (!isBlackScreen) {
        

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
            os.setTimeout(() => {
                Sound.pause(intro)
            }, 3000);
            
        }

        if (isFaceVisible && Date.now() - faceStartTime >= 3000) {
   
            stopAnimations = true;
            isBlackScreen = true;

            blackScreenStartTime = Date.now();
        }

        fadeOut.play();
    } else {



      
        Screen.clear(Color.new(0, 0, 0, 255));
        

        if (Date.now() - blackScreenStartTime >= 2000) {
           
           

            std.loadScript("Source/Scripts/title.js");
            Sound.play(gradual)
            
        }
    }
});
