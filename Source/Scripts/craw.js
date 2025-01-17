const font = new Font("default");

const animationFrames = [];
for (let i = 1; i <= 16; i++) {
    const frame = new Image(`Source/Craw/${i}.png`);
    frame.width = 740;
    frame.height = 548;
    animationFrames.push(frame);
}

let currentFrame = 0;
const normalFrameDelay = 50;
const fastFrameDelay = 20;
let frameDelay = normalFrameDelay;
let lastFrameTime = Date.now();
let isAnimationPlaying = false;

const fast = Sound.load("Source/Craw/fast.wav");
const slow = Sound.load("Source/Craw/slow.wav");

let isFastPlaying = false;
let isSlowPlaying = false;

Sound.pause(slow);
Sound.pause(fast);

const camera = { x: 0, y: 0, speed: 10 };
const screenWidth = 640;
const screenHeight = 480;

function clampCameraPosition() {
    camera.x = Math.max(0, Math.min(camera.x, 740 - screenWidth));
    camera.y = Math.max(0, Math.min(camera.y, 548 - screenHeight));
}

os.setInterval(() => {
    const pad = Pads.get(0);
    pad.update();

    const rx = ((pad.rx > 25 || pad.rx < -25) ? pad.rx : 0) / 500.0;
    const ry = ((pad.ry > 25 || pad.ry < -25) ? pad.ry : 0) / 500.0;

    camera.x += rx * camera.speed;
    camera.y += ry * camera.speed;

    clampCameraPosition();

    Screen.clear();

    if (pad.btns & Pads.UP) {
        isAnimationPlaying = true;

        if (pad.btns & Pads.L1) {
            frameDelay = fastFrameDelay;
            if (!isFastPlaying) {
                Sound.pause(slow);
                Sound.play(fast);
                isFastPlaying = true;
                isSlowPlaying = false;
            }
        } else {
            frameDelay = normalFrameDelay;
            if (!isSlowPlaying) {
                Sound.pause(fast);
                Sound.play(slow);
                isSlowPlaying = true;
                isFastPlaying = false;
            }
        }
    } else {
        isAnimationPlaying = false;
        if (isFastPlaying || isSlowPlaying) {
            Sound.pause(fast);
            Sound.pause(slow);
            isFastPlaying = false;
            isSlowPlaying = false;
        }
    }

    if (isAnimationPlaying) {
        const currentTime = Date.now();
        if (currentTime - lastFrameTime >= frameDelay) {
            currentFrame = (currentFrame + 1) % animationFrames.length;
            lastFrameTime = currentTime;
        }
    }

    animationFrames[currentFrame].draw(-camera.x, -camera.y);

    Screen.flip();
}, 0);
