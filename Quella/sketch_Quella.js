// Global variables
let doveImg;
let strokes = [];     // Array to store brush strokes
let paintingLayer;    // Graphics layer for user painting
let peaceLayer;       // Graphics layer for "PEACE" text


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

  // Center image
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Create brush strokes in 3 layers
  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}


function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  // PPixels with 4px spacing
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;

      // Create brush stroke for bright pixels with 70% probability
      if (brightness > 50 && random() > 0.7) {
        strokes.push(new BrushStroke(
          x + xOffset + random(-2, 2),
          y + yOffset + random(-2, 2),
          color(r, g, b),
          layer
        ));
      }
    }
  }
}


function draw() {
  background("black");

  updateAndDisplayStrokes(); // Update and render all brush strokes
  displayInfoText();         // Show info text
}


function updateAndDisplayStrokes() {
  let t = millis() * 0.001;
  for (let stroke of strokes) {
    stroke.update(t);
    stroke.display();
  }
}

function displayInfoText() {
  fill("white");
  textSize(14);
  text("Perlin Noise Driven Flow", 20, height - 20);
}


class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);     // Original position
    this.pos = createVector(x, y);        // Current position
    this.color = col;                     // Stroke color
    this.layer = layer;                   // Layer depth
    this.seed = random(1000);             // Random seed for unique behavior
    this.length = random(3, 10 + layer * 2); // Stroke length
    this.width = random(3, 8 + layer);    // Stroke width
    this.angle = random(PI);              // Initial rotation
    this.alpha = random(150, 220);        // Transparency
    this.targetPos = createVector(x, y);  // Target position for recovery
    this.recoverySpeed = random(0.02, 0.05); // Speed to return to origin
    this.isAffected = false;              // Mouse interaction flag
  }
  
  update(time) {
    let mouseDist = dist(mouseX, mouseY, this.origin.x, this.origin.y);
    let influenceRadius = 50; // Mouse influence radius

    if (mouseDist < influenceRadius) {
      // Mouse influence behavior
      this.isAffected = true;
      let toMouse = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
      let rotateAngle = map(mouseDist, 0, influenceRadius, PI, 0.1);
      
      // Circular motion around mouse
      this.pos.x = mouseX + cos(time * 3 + this.seed) * toMouse.mag();
      this.pos.y = mouseY + sin(time * 3 + this.seed) * toMouse.mag();
      this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + PI/2;
    } else if (this.isAffected) {
      // Return to original position
      this.pos.lerp(this.targetPos, this.recoverySpeed);
      
      if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
        this.isAffected = false;
      }
      
      // Smooth angle transition
      this.angle = lerp(this.angle, noise(time*0.3 + this.seed)*TWO_PI, 0.05);
    } else {
      // Default perlin noise motion
      let noiseVal = noise(this.origin.x*0.005, this.origin.y*0.005, time*0.3 + this.seed);
      this.angle = noiseVal * TWO_PI * 2;
      let radius = 3 + this.layer * 2;
      this.pos.x = this.origin.x + cos(this.angle) * radius;
      this.pos.y = this.origin.y + sin(this.angle) * radius;
    }
  }

  display() {
    // Add random color variation
    let r = red(this.color) + random(-20, 20);
    let g = green(this.color);
    let b = blue(this.color) + random(-20, 20);
    
    // Constrain to valid color values
    r = constrain(r, 0, 255);
    b = constrain(b, 0, 255);
    
    noStroke();
    fill(r, g, b, this.alpha);
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    ellipse(0, 0, this.length, this.width); // Draw elliptical stroke
    pop();
  }
}








