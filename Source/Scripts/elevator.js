const font = new Font("default");

const elevatorFrames = [];
for (let i = 1; i <= 10; i++) {
    const frame = new Image(`Source/Elevator/Elevator/${i}.png`);
    frame.width = 840;
    frame.height = 648;
    elevatorFrames.push(frame);
}

const redImage = new Image("Source/Elevator/Elevator/red.png");
redImage.width = 840;
redImage.height = 648;

const cursorImage = new Image("Source/Elevator/mouse.png");
cursorImage.width = 16;
cursorImage.height = 16;

const backgroundImage = new Image("Source/Elevator/Elevator Ending/last.png");
backgroundImage.width = 840;
backgroundImage.height = 648;

const newSequenceFrames = [];
for (let i = 1; i <= 11; i++) {
    const frame = new Image(`Source/Elevator/Elevator Ending/${i}.png`);
    frame.width = 840;
    frame.height = 648;
    newSequenceFrames.push(frame);
}

let currentFrame = 0;
const frameDelay = 30;
let lastFrameTime = Date.now();
let animationState = "elevator"; 
let animationStartTime = Date.now();
let sequenceFrame = 0;

const camera = { x: 0, y: 0 };
const cursor = { x: 370, y: 274, speed: 15 };
const screenWidth = 640;
const screenHeight = 480;

let shakeX = 0;
let shakeY = 0;
let shakeIntensity = 3;

let redVisible = false;
let redStartTime = 0;
let redDuration = 0;

const targetRect = { x: 495, y: 220, width: 15, height: 40 };
const secondTargetRect = { x: 320, y: 350, width: 70, height: 50 };


const movingBackgroundImages = [];
const movingImageSpeed = 1; 

function clampCursorPosition() {
    cursor.x = Math.max(0, Math.min(cursor.x, 840));
    cursor.y = Math.max(0, Math.min(cursor.y, 648));
}

function applyShake() {
    shakeX = Math.random() * shakeIntensity * 2 - shakeIntensity;
    shakeY = Math.random() * shakeIntensity * 2 - shakeIntensity;

    shakeX = Math.max(-camera.x, Math.min(shakeX, 840 - screenWidth - camera.x));
    shakeY = Math.max(-camera.y, Math.min(shakeY, 648 - screenHeight - camera.y));
}

function isCursorInRect(rect) {
    return (
        cursor.x >= rect.x &&
        cursor.x <= rect.x + rect.width &&
        cursor.y >= rect.y &&
        cursor.y <= rect.y + rect.height
    );
}

function randomizeRedAppearance() {
    if (!redVisible && Math.random() < 0.01) {
        redVisible = true;
        redStartTime = Date.now();
        redDuration = Math.random() * 1000 + 200;
    } else if (redVisible && Date.now() - redStartTime >= redDuration) {
        redVisible = false;
    }
}

function addBackgroundImage() {
    const randomImage = new Image("Source/Elevator/bg.png");
    randomImage.y = 648;
    movingBackgroundImages.push(randomImage);
}

Screen.display(() => {
    const pad = Pads.get(0);
    pad.update();

    const lx = ((pad.lx > 25 || pad.lx < -25) ? pad.lx : 0) / 300.0;
    const ly = ((pad.ly > 25 || pad.ly < -25) ? pad.ly : 0) / 300.0;

    cursor.x += lx * cursor.speed;
    cursor.y += ly * cursor.speed;

    clampCursorPosition();

    camera.x = Math.max(0, Math.min(cursor.x - screenWidth / 2, 840 - screenWidth));
    camera.y = Math.max(0, Math.min(cursor.y - screenHeight / 2, 648 - screenHeight));

    const elapsedTime = Date.now() - animationStartTime;


    if (animationState === "elevator") {
        applyShake();
        randomizeRedAppearance();

       
        if (Math.random() < 0.02) {
            addBackgroundImage();
        }


        for (let i = 0; i < movingBackgroundImages.length; i++) {
            const img = movingBackgroundImages[i];
            img.y -= movingImageSpeed;
            img.draw(-camera.x + shakeX, img.y - camera.y); 


            if (img.y < -548) {
                movingBackgroundImages.splice(i, 1);
                i--;
            }
        }

        const currentTime = Date.now();
        if (currentTime - lastFrameTime >= frameDelay) {
            lastFrameTime = currentTime;
            currentFrame = (currentFrame + 1) % elevatorFrames.length;
        }

        elevatorFrames[currentFrame].draw(-camera.x + shakeX, -camera.y + shakeY);

        if (redVisible) {
            redImage.draw(-camera.x + shakeX, -camera.y + shakeY);
        }

        if (elapsedTime >= 82000) {
            animationState = "red";
            shakeIntensity = 0; 
        }
    } else if (animationState === "red") {
        redImage.draw(-camera.x, -camera.y);

        if ((pad.justPressed() && isCursorInRect(targetRect)) || (pad.btns & Pads.CROSS)) {
            animationState = "sequence";
            sequenceFrame = 0;
        }
    } else if (animationState === "sequence") {
        backgroundImage.draw(-camera.x, -camera.y);

        const currentTime = Date.now();
        if (sequenceFrame < newSequenceFrames.length - 1 && currentTime - lastFrameTime >= frameDelay) {
            lastFrameTime = currentTime;
            sequenceFrame++;
        }

        newSequenceFrames[sequenceFrame].draw(-camera.x, -camera.y);

        if (sequenceFrame === newSequenceFrames.length - 1) {
            animationState = "consoleAction"; 
        }
    } else if (animationState === "consoleAction") {
        backgroundImage.draw(-camera.x, -camera.y);
        newSequenceFrames[newSequenceFrames.length - 1].draw(-camera.x, -camera.y);

        if ((pad.justPressed() && isCursorInRect(secondTargetRect)) || (pad.btns & Pads.CROSS)) {
            std.reload("Source/Scripts/Elevator.js") 
        }
    }

    cursorImage.draw(cursor.x - camera.x - cursorImage.width / 2, cursor.y - camera.y - cursorImage.height / 2);
});
