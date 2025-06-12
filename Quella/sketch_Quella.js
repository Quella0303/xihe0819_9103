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

  for (let layer = 0; layer < 3; layer++) {
    for (let y = 0; y < doveImg.height; y += 4) {
      for (let x = 0; x < doveImg.width; x += 4) {
        let index = (x + y * doveImg.width) * 4;
        let r = doveImg.pixels[index];
        let g = doveImg.pixels[index + 1];
        let b = doveImg.pixels[index + 2];
        let brightness = (r + g + b) / 3;

        
        if (brightness > 50 && random() > 0.6) {
          strokes.push(new BrushStroke(
            x + xOffset,
            y + yOffset,
            color(r, g, b),
            layer
          ));
        }
      }
    }
  }
}

function draw() {
  background(0);
  let t = millis() * 0.001;

  for (let stroke of strokes) {
    stroke.update(t);
    stroke.display();
  }
}

class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);
    this.pos = createVector(x, y);
    this.color = col;
    this.layer = layer;
    this.seed = random(1000); 
  }

  update(time) {
    let noiseVal = noise(this.origin.x * 0.005, this.origin.y * 0.005, time + this.seed);
    let angle = noiseVal * TWO_PI * 2;
    let radius = 2 + this.layer * 2;
    this.pos.x = this.origin.x + cos(angle) * radius;
    this.pos.y = this.origin.y + sin(angle) * radius;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
}








