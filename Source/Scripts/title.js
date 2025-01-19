const images = [];

for (let i = 1; i <= 4; i++) {
    let folderImages = [];
    for (let j = 1; j <= 4; j++) {
        folderImages.push(new Image(`Source/Title Screen/AM/${i}/${j}.png`));
    }
    images.push(folderImages);
}

const screenfxImages = [];
for (let k = 1; k <= 6; k++) {
    screenfxImages.push(new Image(`Source/Title Screen/${k}.png`));
}

let currentFolderIndex = 0;
let currentImageIndex = 0;
let currentScreenfxIndex = 0;
let folderStartTime = Date.now();

let mainImageDuration = 2000;  
let blinkDuration = 500;     
let folderDuration = 5000;    
let screenfxDuration = 100;  
let blinkingStartTime = null;

Screen.display(() => {
    const currentTime = Date.now();
    


    if (currentTime - folderStartTime < folderDuration) {
       
        if (currentTime - folderStartTime >= folderDuration) {
            currentFolderIndex = (currentFolderIndex + 1) % images.length;  
            folderStartTime = currentTime;  
        }

      
        if (currentTime - folderStartTime < mainImageDuration) {
            currentImageIndex = 0;  

           if (!blinkingStartTime) {
                blinkingStartTime = currentTime;
            }

            if ((currentTime - blinkingStartTime) % blinkDuration < blinkDuration / 2) {
                currentImageIndex = Math.floor(Math.random() * 3) + 1; 
            }
        }


        images[currentFolderIndex][currentImageIndex].draw(0, 0);
    } else {

      
        if (currentTime - folderStartTime >= folderDuration + screenfxDuration * screenfxImages.length) {
            folderStartTime = currentTime; 
        }
    }

    currentScreenfxIndex = Math.floor((currentTime - folderStartTime) / screenfxDuration) % screenfxImages.length;
        screenfxImages[currentScreenfxIndex].draw(0, 0);
});
