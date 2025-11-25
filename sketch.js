let animationFrames = [];
let walkingFrames = [];
let currentFrame = 0;
let animationSpeed = 10; // 幀速度
let frameCounter = 0;
let scaleFactor = 8.1; // 放大倍數
let attackScaleFactor = 8.1; // 攻擊動畫放大倍數
let walkScaleFactor = 6; // 走動動畫放大倍數
let isAnimating = false; // 動畫是否正在播放
let walkingSpriteSheet;
let walkingFrameWidth = 30; // 120 / 4 = 30
let walkingFrameHeight = 16;
let totalWalkingFrames = 4;
let characterX = 0; // 角色位置
let characterY = 0; // 角色位置
let isMirrored = false; // 是否左右鏡像
let isWalking = false; // 是否正在走動
let isPaused = false; // 是否暫停

function preload() {
  // 載入12張攻擊動畫圖片 (0-11)
  for (let i = 0; i < 12; i++) {
    animationFrames.push(loadImage(`1/${i}.png`));
  }
  
  // 載入走動精靈圖片
  walkingSpriteSheet = loadImage(`1/44.png`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色位置在中央
  characterX = windowWidth / 2;
  characterY = windowHeight / 2;
}

function draw() {
  // 設置背景色
  background('#CEFFCE');
  
  if (isPaused) {
    // 暫停時，顯示當前幀
    if (isAnimating && currentFrame < animationFrames.length) {
      let currentImage = animationFrames[currentFrame];
      let scaledWidth = currentImage.width * attackScaleFactor;
      let scaledHeight = currentImage.height * attackScaleFactor;
      let x = windowWidth / 2 - scaledWidth / 2;
      let y = windowHeight / 2 - scaledHeight / 2;
      image(currentImage, x, y, scaledWidth, scaledHeight);
    } else if (isWalking) {
      // 顯示走動動畫當前幀
      let sourceX = currentFrame * walkingFrameWidth;
      let sourceY = 0;
      let scaledWidth = walkingFrameWidth * walkScaleFactor;
      let scaledHeight = walkingFrameHeight * walkScaleFactor;
      let y = characterY - scaledHeight / 2;
      let x = characterX - scaledWidth / 2;
      
      push();
      if (isMirrored) {
        translate(x + scaledWidth, y);
        scale(-1, 1);
        image(
          walkingSpriteSheet,
          0, 0, scaledWidth, scaledHeight,
          sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
        );
      } else {
        image(
          walkingSpriteSheet,
          x, y, scaledWidth, scaledHeight,
          sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
        );
      }
      pop();
    }
  } else if (isAnimating) {
    // 攻擊動畫播放
    frameCounter++;
    if (frameCounter >= animationSpeed) {
      frameCounter = 0;
      currentFrame++;
      
      // 動畫完成後停止
      if (currentFrame >= animationFrames.length) {
        isAnimating = false;
        currentFrame = 0;
      }
    }
    
    // 獲取當前幀圖片
    let currentImage = animationFrames[currentFrame];
    
    // 計算放大後的尺寸
    let scaledWidth = currentImage.width * attackScaleFactor;
    let scaledHeight = currentImage.height * attackScaleFactor;
    
    // 在畫布中央顯示動畫
    let x = windowWidth / 2 - scaledWidth / 2;
    let y = windowHeight / 2 - scaledHeight / 2;
    
    // 繪製動畫
    image(currentImage, x, y, scaledWidth, scaledHeight);
  } else if (isWalking) {
    // 走動動畫
    frameCounter++;
    if (frameCounter >= animationSpeed) {
      frameCounter = 0;
      currentFrame++;
      
      // 根據方向移動角色
      if (isMirrored) {
        characterX -= 3; // 向左移動
      } else {
        characterX += 3; // 向右移動
      }
      
      // 重置幀位置
      if (currentFrame >= totalWalkingFrames) {
        currentFrame = 0;
      }
    }
    
    // 計算當前幀的位置
    let sourceX = currentFrame * walkingFrameWidth;
    let sourceY = 0;
    
    // 計算放大後的尺寸
    let scaledWidth = walkingFrameWidth * walkScaleFactor;
    let scaledHeight = walkingFrameHeight * walkScaleFactor;
    
    // 計算顯示位置
    let y = characterY - scaledHeight / 2;
    let x = characterX - scaledWidth / 2;
    
    // 推送矩陣、鏡像、繪製、恢復矩陣
    push();
    
    if (isMirrored) {
      translate(x + scaledWidth, y);
      scale(-1, 1);
      image(
        walkingSpriteSheet,
        0, 0, scaledWidth, scaledHeight,
        sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
      );
    } else {
      image(
        walkingSpriteSheet,
        x, y, scaledWidth, scaledHeight,
        sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
      );
    }
    
    pop();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    // 左鍵：向左走動
    isWalking = true;
    isAnimating = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    isMirrored = true;
    return false;
  } else if (keyCode === RIGHT_ARROW) {
    // 右鍵：向右走動
    isWalking = true;
    isAnimating = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    isMirrored = false;
    return false;
  } else if (keyCode === UP_ARROW) {
    // 上鍵：播放攻擊動畫
    isAnimating = true;
    isWalking = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    return false;
  } else if (keyCode === DOWN_ARROW) {
    // 下鍵：暫停
    isPaused = true;
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 設置背景色
  background('#CEFFCE');
  
  if (isPaused) {
    // 暫停時，顯示當前幀
    if (isAnimating && currentFrame < animationFrames.length) {
      let currentImage = animationFrames[currentFrame];
      let scaledWidth = currentImage.width * scaleFactor;
      let scaledHeight = currentImage.height * scaleFactor;
      let x = windowWidth / 2 - scaledWidth / 2;
      let y = windowHeight / 2 - scaledHeight / 2;
      image(currentImage, x, y, scaledWidth, scaledHeight);
    } else if (isWalking) {
      // 顯示走動動畫當前幀
      let sourceX = currentFrame * walkingFrameWidth;
      let sourceY = 0;
      let scaledWidth = walkingFrameWidth * scaleFactor;
      let scaledHeight = walkingFrameHeight * scaleFactor;
      let y = characterY - scaledHeight / 2;
      let x = characterX - scaledWidth / 2;
      
      push();
      if (isMirrored) {
        translate(x + scaledWidth, y);
        scale(-1, 1);
        image(
          walkingSpriteSheet,
          0, 0, scaledWidth, scaledHeight,
          sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
        );
      } else {
        image(
          walkingSpriteSheet,
          x, y, scaledWidth, scaledHeight,
          sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
        );
      }
      pop();
    }
  } else if (isAnimating) {
    // 攻擊動畫播放
    frameCounter++;
    if (frameCounter >= animationSpeed) {
      frameCounter = 0;
      currentFrame++;
      
      // 動畫完成後停止
      if (currentFrame >= animationFrames.length) {
        isAnimating = false;
        currentFrame = 0;
      }
    }
    
    // 獲取當前幀圖片
    let currentImage = animationFrames[currentFrame];
    
    // 計算放大後的尺寸
    let scaledWidth = currentImage.width * scaleFactor;
    let scaledHeight = currentImage.height * scaleFactor;
    
    // 在畫布中央顯示動畫
    let x = windowWidth / 2 - scaledWidth / 2;
    let y = windowHeight / 2 - scaledHeight / 2;
    
    // 繪製動畫
    image(currentImage, x, y, scaledWidth, scaledHeight);
  } else if (isWalking) {
    // 走動動畫
    frameCounter++;
    if (frameCounter >= animationSpeed) {
      frameCounter = 0;
      currentFrame++;
      
      // 根據方向移動角色
      if (isMirrored) {
        characterX -= 3; // 向左移動
      } else {
        characterX += 3; // 向右移動
      }
      
      // 重置幀位置
      if (currentFrame >= totalWalkingFrames) {
        currentFrame = 0;
      }
    }
    
    // 計算當前幀的位置
    let sourceX = currentFrame * walkingFrameWidth;
    let sourceY = 0;
    
    // 計算放大後的尺寸
    let scaledWidth = walkingFrameWidth * scaleFactor;
    let scaledHeight = walkingFrameHeight * scaleFactor;
    
    // 計算顯示位置
    let y = characterY - scaledHeight / 2;
    let x = characterX - scaledWidth / 2;
    
    // 推送矩陣、鏡像、繪製、恢復矩陣
    push();
    
    if (isMirrored) {
      translate(x + scaledWidth, y);
      scale(-1, 1);
      image(
        walkingSpriteSheet,
        0, 0, scaledWidth, scaledHeight,
        sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
      );
    } else {
      image(
        walkingSpriteSheet,
        x, y, scaledWidth, scaledHeight,
        sourceX, sourceY, walkingFrameWidth, walkingFrameHeight
      );
    }
    
    pop();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    // 左鍵：向左走動
    isWalking = true;
    isAnimating = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    isMirrored = true;
    return false;
  } else if (keyCode === RIGHT_ARROW) {
    // 右鍵：向右走動
    isWalking = true;
    isAnimating = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    isMirrored = false;
    return false;
  } else if (keyCode === UP_ARROW) {
    // 上鍵：播放攻擊動畫
    isAnimating = true;
    isWalking = false;
    isPaused = false;
    currentFrame = 0;
    frameCounter = 0;
    return false;
  } else if (keyCode === DOWN_ARROW) {
    // 下鍵：暫停
    isPaused = true;
    return false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
