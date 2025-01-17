const cursorImage = new Image("Source/Elevator/mouse.png");
cursorImage.width = 16;
cursorImage.height = 16;

const mainHubFrames = [];
for (let i = 1; i <= 16; i++) {
    const frame = new Image(`Source/Main Hub/Office/${i}.png`);
    frame.width = 740;
    frame.height = 548;
    mainHubFrames.push(frame);
}

let currentFrame = 0;
const frameDelay = 30;
let lastFrameTime = Date.now();
const screenWidth = 640;
const screenHeight = 448;

const camera = { x: 0, y: 0 };
const cursor = { x: 370, y: 274, speed: 10 };

function clampCursorPosition() {
    cursor.x = Math.max(0, Math.min(cursor.x, 740));
    cursor.y = Math.max(0, Math.min(cursor.y, 548));
}


const audio1 = Sound.load("Source/Main Hub/HandUnit04B.wav");
const normal = new Image("Source/Main Hub/normal.png")

Sound.play(audio1)

Screen.display(() => {
    const pad = Pads.get(0);
    pad.update();

    const lx = ((pad.lx > 25 || pad.lx < -25) ? pad.lx : 0) / 300.0;
    const ly = ((pad.ly > 25 || pad.ly < -25) ? pad.ly : 0) / 300.0;

    cursor.x += lx * cursor.speed;
    cursor.y += ly * cursor.speed;

    clampCursorPosition();

    camera.x = Math.max(0, Math.min(cursor.x - screenWidth / 2, 740 - screenWidth));
    camera.y = Math.max(0, Math.min(cursor.y - screenHeight / 2, 548 - screenHeight));

    const currentTime = Date.now();
    if (currentTime - lastFrameTime >= frameDelay) {
        lastFrameTime = currentTime;
        currentFrame = (currentFrame + 1) % mainHubFrames.length;
    }

    mainHubFrames[currentFrame].draw(-camera.x, -camera.y);
    normal.draw(-camera.x + 150, -camera.y + 300)
    cursorImage.draw(cursor.x - camera.x - cursorImage.width / 2, cursor.y - camera.y - cursorImage.height / 2);
});
