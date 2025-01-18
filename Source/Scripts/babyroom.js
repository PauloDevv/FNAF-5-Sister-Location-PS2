const animationFrames = [];
for (let i = 1; i <= 11; i++) {
    const frame = new Image(`Source/Main Hub/Baby Room/bg/${i}.png`);
    frame.width = 840;
    frame.height = 648;
    animationFrames.push(frame);
}

let currentFrame = 0;
const frameDelay = 30;
let lastFrameTime = Date.now();

const cursorImage = new Image("Source/Elevator/mouse.png");
cursorImage.width = 16;
cursorImage.height = 16;

const screenWidth = 640;
const screenHeight = 448;

const cursor = { x: 370, y: 274, speed: 15 };
const camera = { x: 0, y: 0 };

const audio1 = Sound.load("Source/Main hub/Baby Room/audio1.wav");

Sound.play(audio1);


const frontImage = new Image("Source/Main Hub/Baby Room/normal.png");

const secondImage = new Image("Source/Main Hub/Baby Room/two.png");

const overlay = new Image("Source/Main Hub/Baby Room/overlay.png");

let timeElapsed = 0;
let rectangles = [
    { x: 597, y: 367, width: 30, height: 15, color: Color.new(255, 0, 0, 255), name: "Retângulo 1" },
    { x: 594, y: 385, width: 30, height: 15, color: Color.new(255, 100, 0, 255), name: "Retângulo 2" },
];

function clampCursorPosition() {
    cursor.x = Math.max(0, Math.min(cursor.x, animationFrames[currentFrame].width));
    cursor.y = Math.max(0, Math.min(cursor.y, animationFrames[currentFrame].height));
}

function clampCameraPosition() {
    camera.x = Math.max(0, Math.min(cursor.x - screenWidth / 2, animationFrames[currentFrame].width - screenWidth));
    camera.y = Math.max(0, Math.min(cursor.y - screenHeight / 2, animationFrames[currentFrame].height - screenHeight));
}

function isCursorInRectangle(rect) {
    return cursor.x >= rect.x && cursor.x <= rect.x + rect.width &&
           cursor.y >= rect.y && cursor.y <= rect.y + rect.height;
}

Screen.display(() => {
    const pad = Pads.get(0);
    pad.update();

    const lx = ((pad.lx > 25 || pad.lx < -25) ? pad.lx : 0) / 300.0;
    const ly = ((pad.ly > 25 || pad.ly < -25) ? pad.ly : 0) / 300.0;

    cursor.x += lx * cursor.speed;
    cursor.y += ly * cursor.speed;

    clampCursorPosition();
    clampCameraPosition();

    const currentTime = Date.now();
    if (currentTime - lastFrameTime >= frameDelay) {
        lastFrameTime = currentTime;
        currentFrame = (currentFrame + 1) % animationFrames.length;
    }

    animationFrames[currentFrame].draw(-camera.x, -camera.y);

    frontImage.draw(-camera.x + 545, -camera.y + 305);

    timeElapsed += frameDelay;
    if (timeElapsed >= 10500) {
        secondImage.draw(-camera.x + 545, -camera.y + 305);


        rectangles.forEach(rect => {
            Draw.rect(-camera.x + rect.x, -camera.y + rect.y, rect.width, rect.height, rect.color);

            if (isCursorInRectangle(rect) && (pad.btns & Pads.CROSS)) {
                console.log(`${rect.name} pressionado!`);
            }
        });
    }
    
    cursorImage.draw(cursor.x - camera.x - cursorImage.width / 2, cursor.y - camera.y - cursorImage.height / 2);

    overlay.color = Color.new(255, 255, 255, 20);
    overlay.draw(0, 0);
});
