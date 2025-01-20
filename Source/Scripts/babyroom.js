let audioManager = {
    audioPaths: {
        buzz: "Source/Main Hub/Baby Room/buzz.adp",
        energy: "Source/Main Hub/Baby Room/energy.adp",
        audio1: "Source/Main Hub/Baby Room/audio1.wav",
        audio2: "Source/Main Hub/Baby Room/audio2.wav",
        audio3: "Source/Main Hub/Baby Room/audio3.wav",
        greatjob: "Source/Main Hub/Baby Room/greatjob.wav",
    },
    currentAudio: null,
    playing: false,

    play(audioKey) {
        this.stop();
        if (!this.audioPaths[audioKey]) {
            console.log("Audio not found: " + audioKey);
            return;
        }
        this.currentAudio = Sound.load(this.audioPaths[audioKey]);
        Sound.play(this.currentAudio);
        this.playing = true;
        console.log("Playing audio: " + audioKey);
    },

    stop() {
        if (this.currentAudio) {
            Sound.pause(this.currentAudio);
            this.currentAudio = null;
            this.playing = false;
            console.log("Stopped audio");
        }
    },
};

const animationFrames = [];
for (let i = 1; i <= 11; i++) {
    const frame = new Image("Source/Main Hub/Baby Room/bg/" + i + ".png");
    frame.width = 840;
    frame.height = 648;
    animationFrames.push(frame);
}

const font = new Font("default")
let currentFrame = 0;
const frameDelay = 30;
let lastFrameTime = Date.now();

const cursorImage = new Image("Source/Elevator/mouse.png");
cursorImage.width = 16;
cursorImage.height = 16;

const screenWidth = 640;
const screenHeight = 448;

const cursor = { x: 370, y: 274, speed: 10 };
const camera = { x: 0, y: 0 };

const frontImage = new Image("Source/Main Hub/Baby Room/normal.png");
let secondImage = new Image("Source/Main Hub/Baby Room/two.png");
const shock = new Image("Source/Main Hub/Baby Room/chock.png");
const lightPressedImage = new Image("Source/Main Hub/Baby Room/lightpressed.png");

const overlay = new Image("Source/Main Hub/Baby Room/overlay.png");

const shock1 = new Image("Source/Main Hub/Baby Room/test.png")
shock1.width = 840;
shock1.height = 648;

let timeElapsed = 0;
let rectangles = [
    { x: 597, y: 367, width: 30, height: 15, color: Color.new(255, 0, 0, 255), name: "Retângulo 1", action: "buzz" },
    { x: 594, y: 385, width: 30, height: 15, color: Color.new(255, 100, 0, 255), name: "Retângulo 2", action: "energy" },
];

let lightPressed = false;
let lightPressedStartTime = 0;
let shockActive = false;
let shockStartTime = 0;

let step = 0; 

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





var free_mem
var free_vram
var ram_usage = System.getMemoryStats()

let ramUse = (ram_usage.used / 1048576).toFixed(2)


let alpha = 100;
let alphaDirection = -10;
let shockBlinkStartTime = 0;
let blinkingActive = false; 

const energyd = new Image("Source/Main Hub/Baby Room/test2.png"); 
energyd.width = 840;
energyd.height = 648;

    
audioManager.play("audio1");

function updateShockBlinkEffect(currentTime) {
    if (currentTime - shockBlinkStartTime < 3000) { 
        alpha += alphaDirection * Math.random() * 5; 
        if (alpha <= 50 || alpha >= 255) { 
            alphaDirection *= -1; 
        }
        alpha = Math.max(50, Math.min(alpha, 255)); 
        shock1.color = Color.new(255, 255, 255, Math.floor(alpha)); 
        shock1.draw(-camera.x, -camera.y); 
    } else {
        blinkingActive = false; 
    }
}

let showEnergyd = false; 

os.setTimeout(() => {
    audioManager.stop("audio1");
}, 6500);

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
 
    if (blinkingActive) {
        updateShockBlinkEffect(currentTime); 
    }
    

    if (showEnergyd && currentTime - energydVisibleStartTime < 3000) {
        energyd.draw(-camera.x, -camera.y); 
    }
    
    timeElapsed += frameDelay;
    if (timeElapsed >= 10500) {
        
 
        if ((!lightPressed || currentTime - lightPressedStartTime >= 3300) && 
            (!shockActive || currentTime - shockStartTime >= 2000)) {
            secondImage.draw(-camera.x + 545, -camera.y + 305);
        } else if (lightPressed && currentTime - lightPressedStartTime < 3000) {
            lightPressedImage.draw(-camera.x + 545, -camera.y + 305);
        } else if (shockActive && currentTime - shockStartTime < 2000) {
            shock.draw(-camera.x + 545, -camera.y + 305);
        }

        

        rectangles.forEach(rect => {
            if (isCursorInRectangle(rect) && (pad.btns & Pads.CROSS)) {
                switch (step) {
                    case 0:
                        
                        if (rect.name === "Retângulo 1") {
                            showEnergyd = true; 
                            energydVisibleStartTime = currentTime; 
                            
                         
                            audioManager.play("buzz");
                            lightPressed = true;
                            lightPressedStartTime = currentTime;
                            shockActive = false;

                            os.setTimeout(() => {
                                audioManager.stop("buzz");

                             
                                audioManager.play("audio2");
                                os.setTimeout(() => {
                                    audioManager.stop("audio2");
                                    step = 1; 
                                }, 7000);
                            }, 6000);
                        }
                        break;
        
                    case 1:
                       
                        if (rect.name === "Retângulo 2") {
                            blinkingActive = true; 
                            shockBlinkStartTime = currentTime; 
                            shockActive = true;
                            shockStartTime = currentTime;
                            lightPressed = false;
                        
    
                            audioManager.play("energy");
                            os.setTimeout(() => {
                                audioManager.stop("energy");
                                step = 2; 
                                blinkingActive = false; 
                            }, 6000);
                        }
                        
                        break;
        
                    case 2:
 
                        if (rect.name === "Retângulo 1") {
                            showEnergyd = true; 
                            energydVisibleStartTime = currentTime; 
                            lightPressed = true;
                            lightPressedStartTime = currentTime;
                            shockActive = false;
        

                            audioManager.play("buzz");
                            os.setTimeout(() => {
                                audioManager.stop("buzz");
        
                                audioManager.play("audio3");
                                os.setTimeout(() => {
                                    audioManager.stop("audio3");
                                    step = 3;
                                }, 2200);
                            }, 6000); 
                        }
                        break;
        
                    case 3:
             
                        if (rect.name === "Retângulo 2") {
                            blinkingActive = true; 
                            shockBlinkStartTime = currentTime; 
                            shockActive = true;
                            shockStartTime = currentTime;
                            lightPressed = false;
        
                            audioManager.play("energy");
                            os.setTimeout(() => {
                                audioManager.stop("energy");
                                step = 4;
                            }, 6000); 
                        }
                        break;
        
                    case 4:

                        if (rect.name === "Retângulo 1") {
                            showEnergyd = true; 
                            energydVisibleStartTime = currentTime; 
                            lightPressed = true;
                            lightPressedStartTime = currentTime;
                            shockActive = false;
        

                            audioManager.play("buzz");
                            os.setTimeout(() => {
                                audioManager.stop("buzz");
                               
        
                               
                                audioManager.play("audio3");
                                os.setTimeout(() => {
                                    audioManager.stop("audio3");
                                    step = 5;
                                }, 1000);
                            }, 6000); 
                        }
                        break;
        
                    case 5:
                       
                        if (rect.name === "Retângulo 2") {
                            blinkingActive = true; 
                            shockBlinkStartTime = currentTime; 
                            shockActive = true;
                            shockStartTime = currentTime;
                            lightPressed = false;
        
                      
                            audioManager.play("energy");
                            os.setTimeout(() => {
                                audioManager.stop("energy");
                                step = 6;
                            }, 6000); 
                        }
                        break;
        
                    case 6:
         
                        if (rect.name === "Retângulo 1") {
                            showEnergyd = true; 
                            energydVisibleStartTime = currentTime; 
                            lightPressed = true;
                            lightPressedStartTime = currentTime;
                            shockActive = false;
       
                            audioManager.play("buzz");
                            os.setTimeout(() => {
                                audioManager.stop("buzz");
        
               
                                audioManager.play("greatjob");
                                
                            }, 6000); 
                        }
                        break;
                }
            }
        });
    }        

    cursorImage.draw(cursor.x - camera.x - cursorImage.width / 2, cursor.y - camera.y - cursorImage.height / 2);
    overlay.color = Color.new(255, 255, 255, 20);
    overlay.draw(0, 0);

    free_mem = System.getMemoryStats();
    free_vram = Screen.getFreeVRAM();
    ram_usage = System.getMemoryStats();

    ramUse = (ram_usage.used / 1048576).toFixed(2)
    
     

});
