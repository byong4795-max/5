// Clean sketch: play attack sprite centered (10x) and walk sprite (5 frames) frame-by-frame

let attackSheet, walkSheet;
let attackFrames = [];
let walkFrames = [];

let mode = 'attack'; // 'attack' or 'walk'
let frameIndex = 0;
let frameCounter = 0;
let animationSpeed = 8;

const ATTACK_FRAME_W = 391;
const ATTACK_FRAME_H = 20;
const ATTACK_SCALE = 10;

const WALK_FRAMES_COUNT = 5;
let walkFrameW = 0;
let walkFrameH = 0;
const WALK_SCALE = 6;

let isMirrored = false;

function preload() {
  attackSheet = loadImage('1/391 20.png');
  walkSheet = loadImage('1/44.png');

  // split attack frames
  let totalAttack = Math.max(1, Math.floor(attackSheet.width / ATTACK_FRAME_W));
  for (let i = 0; i < totalAttack; i++) {
    let img = createImage(ATTACK_FRAME_W, ATTACK_FRAME_H);
    img.copy(attackSheet, i * ATTACK_FRAME_W, 0, ATTACK_FRAME_W, ATTACK_FRAME_H, 0, 0, ATTACK_FRAME_W, ATTACK_FRAME_H);
    attackFrames.push(img);
  }

  // split walk frames based on actual width (ensure separate frames)
  walkFrameW = Math.floor(walkSheet.width / WALK_FRAMES_COUNT);
  walkFrameH = walkSheet.height;
  for (let i = 0; i < WALK_FRAMES_COUNT; i++) {
    let img = createImage(walkFrameW, walkFrameH);

            frameCounter = 0;
            frameIndex = (frameIndex + 1) % attackFrames.length;
          }
          let img = attackFrames[frameIndex];
          let sw = ATTACK_FRAME_W * ATTACK_SCALE;
          let sh = ATTACK_FRAME_H * ATTACK_SCALE;
          let x = (width - sw) / 2;
          let y = (height - sh) / 2;
          image(img, x, y, sw, sh);
        } else if (mode === 'walk') {
          if (walkFrames.length === 0) return;
          frameCounter++;
          if (frameCounter >= animationSpeed) {
            frameCounter = 0;
            frameIndex = (frameIndex + 1) % walkFrames.length;
          }
          let img = walkFrames[frameIndex];
          let sw = walkFrameW * WALK_SCALE;
          let sh = walkFrameH * WALK_SCALE;
          let x = (width - sw) / 2;
          let y = (height - sh) / 2;

          push();
          if (isMirrored) {
            translate(x + sw, y);
            scale(-1, 1);
            image(img, 0, 0, sw, sh);
          } else {
            image(img, x, y, sw, sh);
          }
          pop();
        }
      }

      function mousePressed() {
        // 左鍵走左（鏡像）、右鍵走右
        if (mouseButton === LEFT) {
          mode = 'walk';
          isMirrored = true;
          frameIndex = 0;
          frameCounter = 0;
          return false; // 防止瀏覽器預設行為
        }
        if (mouseButton === RIGHT) {
          mode = 'walk';
          isMirrored = false;
          frameIndex = 0;
          frameCounter = 0;
          return false;
        }
      }

      function mouseReleased() {
        // 放開滑鼠回到攻擊動畫
        mode = 'attack';
        frameIndex = 0;
        frameCounter = 0;
      }

      function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
      }
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
