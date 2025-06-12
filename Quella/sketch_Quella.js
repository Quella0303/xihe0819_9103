// Global variables
let doveImg;
let strokes = [];

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  setupDoveImage();
}

function setupDoveImage() {
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}

function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      let i = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[i];
      let g = doveImg.pixels[i + 1];
      let b = doveImg.pixels[i + 2];
      let brightness = (r + g + b) / 3;

      if (brightness > 50 && random() > 0.7) {
        let c = color(
          constrain(r + random(-20, 20), 0, 255),
          constrain(g + random(-15, 15), 0, 255),
          constrain(b + random(-20, 20), 0, 255)
        );

        let posX = x + xOffset + random(-3, 3);
        let posY = y + yOffset + random(-3, 3);

        strokes.push(new BrushStroke(posX, posY, c, layer));
      }
    }
  }
}

function draw() {
  background(0);
  let t = millis() * 0.001;

  for (let s of strokes) {
    s.update(t);
    s.display();
  }

  fill(255);
  textSize(14);
  text("Version 2a: Perlin Noise Animation Only", 20, height - 20);
}

// Brush stroke class
class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);
    this.pos = createVector(x, y);
    this.color = col;
    this.layer = layer;
    this.seed = random(1000);     // For unique Perlin noise per stroke
    this.angle = random(TWO_PI);
    this.length = random(4, 10 + layer * 2);
    this.width = random(3, 8 + layer);
    this.alpha = random(150, 220);
  }

  update(t) {
    let n = noise(this.origin.x * 0.005, this.origin.y * 0.005, t * 0.3 + this.seed);
    this.angle = n * TWO_PI * 2;
    let radius = 3 + this.layer * 2;
    this.pos.x = this.origin.x + cos(this.angle) * radius;
    this.pos.y = this.origin.y + sin(this.angle) * radius;
  }

  display() {
    let r = constrain(red(this.color) + random(-5, 5), 0, 255);
    let g = constrain(green(this.color) + random(-4, 4), 0, 255);
    let b = constrain(blue(this.color) + random(-5, 5), 0, 255);
    let alpha = constrain(this.alpha + random(-10, 10), 100, 255);

    noStroke();
    fill(r, g, b, alpha);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    ellipse(0, 0, this.length, this.width);
    pop();
  }
}









