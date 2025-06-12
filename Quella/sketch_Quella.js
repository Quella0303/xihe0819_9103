let doveImg;
let strokes = [];

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;

      if (brightness > 50) {
        strokes.push({ x: x + xOffset, y: y + yOffset, col: color(r, g, b) });
      }
    }
  }

  noLoop(); 
}

function draw() {
  background(0);
  noStroke();
  for (let s of strokes) {
    fill(s.col);
    ellipse(s.x, s.y, 4, 4);
  }
}







