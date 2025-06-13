let doveImg;         // Group image: the dove
let strokes = [];    // Array to store all brushstroke particles

function preload() {
  // Load the dove image before setup runs
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);  // Create a canvas that fits the screen
  pixelDensity(1);                          // Avoid automatic scaling on high-res screens

  doveImg.resize(1000, 0);  // Resize the image to a fixed width
  doveImg.loadPixels();     // Load the pixel data so we can read colors later

  // Calculate offsets to center the image on the canvas
  let xOff = (width - doveImg.width) / 2;
  let yOff = (height - doveImg.height) / 2;

  // Create multiple layers of brushstrokes for visual depth
  for (let l = 0; l < 3; l++) {
    for (let y = 0; y < doveImg.height; y += 4) {
      for (let x = 0; x < doveImg.width; x += 4) {
        let i = (x + y * doveImg.width) * 4;  // Get pixel index
        let r = doveImg.pixels[i];
        let g = doveImg.pixels[i + 1];
        let b = doveImg.pixels[i + 2];
        let bright = (r + g + b) / 3;         // Calculate brightness

        // Only keep bright pixels and apply some randomness to create a scattered look
        if (bright > 50 && random() > 0.7) {
          // Slightly vary the color using random noise
          let c = color(
            constrain(r + random(-20, 20), 0, 255),
            constrain(g + random(-15, 15), 0, 255),
            constrain(b + random(-20, 20), 0, 255)
          );

           // Position also slightly jittered by random()
          strokes.push(new BrushStroke(
            x + xOff + random(-3, 3),
            y + yOff + random(-3, 3),
            c, l
          ));
        }
      }
    }
  }
}

function draw() {
  background(0);               // Black background 
  let t = millis() * 0.001;    // Time in seconds (used for animation)

  // Update and draw each brushstroke
  for (let s of strokes) {
    s.update(t);  // Update stroke position
    s.show();     // Draw stroke
  }

  // Display a label on the screen
  fill(255);
  textSize(14);
  text("Perlin + Random Ink Motion", 20, height - 20);
}

// Brush stroke class
class BrushStroke {
  constructor(x, y, c, l) {
    this.origin = createVector(x, y);     // Original (starting) position
    this.pos = this.origin.copy();        // Current position (can move)
    this.col = c;                         // Base color
    this.lay = l;                         // Layer index (used to change size/speed)
    this.seed = random(1000);             // Unique seed for Perlin noise
    this.len = random(4, 12 + l * 2);     // Length of stroke
    this.wid = random(3, 9 + l);          // Width of stroke
    this.a = random(TWO_PI);              // Angle of rotation
    this.alpha = random(120, 230);        // Transparency
    this.back = this.origin.copy();       // Target position to return to
    this.backSpeed = random(0.02, 0.05);  // Speed of returning to origin
    this.hit = false;                     // Whether mouse is affecting it
    this.ink = false;                     // Whether in "ink" mode
    this.jitter = random(0.5, 1.5);       // Small movement noise
  }

  update(t) {
    let d = dist(mouseX, mouseY, this.origin.x, this.origin.y);

    if (d < 60) {
      // When close to mouse, enter "ink mode"
      this.hit = true;
      this.ink = true;

      // Move based on direction from original position to mouse
      let diff = createVector(mouseX - this.origin.x, mouseY - this.origin.y);

      // Flow motion around mouse, using Perlin time + random seed
      this.pos.x = mouseX + cos(t * 2 + this.seed) * diff.mag();
      this.pos.y = mouseY + sin(t * 2 + this.seed) * diff.mag();
      this.a = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
    } else if (this.hit) {
      // After mouse leaves, return to original position smoothly
      this.pos.lerp(this.back, this.backSpeed);
      if (dist(this.pos.x, this.pos.y, this.back.x, this.back.y) < 1) {
        this.hit = false;
        this.ink = false;
      }
      // Smooth rotation using Perlin noise
      this.a = lerp(this.a, noise(t * 0.3 + this.seed) * TWO_PI, 0.05);
    } else {
      // Default idle motion: subtle movement using noise and small jitter
      let n = noise(this.origin.x * 0.005, this.origin.y * 0.005, t * 0.3 + this.seed);
      this.a = n * TWO_PI * 2 + random(-0.05, 0.05);  // Add rotation wobble
      let r = 3 + this.lay * 2;  // Movement radius depends on layer
      this.pos.x = this.origin.x + cos(this.a) * r + random(-this.jitter, this.jitter);
      this.pos.y = this.origin.y + sin(this.a) * r + random(-this.jitter, this.jitter);
    }
  }

  show() {
    let r, g, b;

    if (this.ink) {
      // Ink mode uses grayscale values with noise-driven brightness
      let n = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01);
      let gray = n * 255;
      if (random() > 0.5) {
        r = g = b = gray * 0.2 + random(10, 30);  // Dark ink variation
      } else {
        r = g = b = gray * 0.9 + random(20, 40);  // Light ink variation
      }
    } else {
      // Normal color mode with small color variation (adds texture)
      r = constrain(red(this.col) + random(-5, 5), 0, 255);
      g = constrain(green(this.col) + random(-4, 4), 0, 255);
      b = constrain(blue(this.col) + random(-5, 5), 0, 255);
    }

    // Slight alpha flickering for more dynamic feel
    let a = constrain(this.alpha + random(-10, 10), 80, 255);

    // Draw the brushstroke as a rotated ellipse
    noStroke();
    fill(r, g, b, a);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    ellipse(0, 0, this.len, this.wid);
    pop();
  }
}
