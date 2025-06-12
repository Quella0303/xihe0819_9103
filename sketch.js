

let doveImg;         // Dove image
let strokes = [];    // All brush stroke particles

function preload() {
 doveImg = loadImage("assets/dovefinal.png");  // Load image before setup
}

function setup() {
 createCanvas(windowWidth, windowHeight);  // Full-screen canvas
 pixelDensity(1);                          // Avoid scaling for retina displays
 doveImg.resize(1000, 0);                  // Resize image to fixed width
 doveImg.loadPixels();                     // Load pixel data for color detection


 let xOff = (width - doveImg.width) / 2;   // Center image horizontally
 let yOff = (height - doveImg.height) / 2; // Center image vertically


 for (let l = 0; l < 3; l++) {             // Three layers for depth effect
   for (let y = 0; y < doveImg.height; y += 4) {
     for (let x = 0; x < doveImg.width; x += 4) {
       let i = (x + y * doveImg.width) * 4;    // Pixel index
       let r = doveImg.pixels[i];
       let g = doveImg.pixels[i + 1];
       let b = doveImg.pixels[i + 2];
       let bright = (r + g + b) / 3;          // Average brightness


       // Only keep bright pixels, with some randomness
       if (bright > 50 && random() > 0.7) {
         // Add small color variation using random()
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
 background(0);                    // Black background
 let t = millis() * 0.001;         // Time in seconds


 for (let s of strokes) {
   s.update(t);                    // Update stroke position
   s.show();                       // Draw stroke
 }


 fill(255);
 textSize(14);
 text("Perlin + Random Ink Motion", 20, height - 20);  // Caption
}


// Brush stroke class
class BrushStroke {
 constructor(x, y, c, l) {
 this.origin = createVector(x, y);     // Original (starting) position
 this.pos = this.origin.copy();        // Current position
 this.col = c;                         // Base color
 this.lay = l;                         // Layer index (depth)
 this.seed = random(1000);             // Unique random seed per stroke
 this.len = random(4, 12 + l * 2);     // Length (randomized)
 this.wid = random(3, 9 + l);          // Width (randomized)
 this.a = random(TWO_PI);              // Initial angle
 this.alpha = random(120, 230);        // Transparency
 this.back = this.origin.copy();       // Target to return to
 this.backSpeed = random(0.02, 0.05);  // Recovery speed
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


  let diff = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
  // Flow motion around mouse, using Perlin time + random seed
  this.pos.x = mouseX + cos(t * 2 + this.seed) * diff.mag();
  this.pos.y = mouseY + sin(t * 2 + this.seed) * diff.mag();
  this.a = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + HALF_PI;
   } else if (this.hit) {
  // Smoothly return to original position using lerp()
  this.pos.lerp(this.back, this.backSpeed);
  if (dist(this.pos.x, this.pos.y, this.back.x, this.back.y) < 1) {
  this.hit = false;
  this.ink = false;
  }
  // Smooth angle using noise()
  this.a = lerp(this.a, noise(t * 0.3 + this.seed) * TWO_PI, 0.05);
   } else {
  // Regular flow motion using Perlin noise and some random()
  let n = noise(this.origin.x * 0.005, this.origin.y * 0.005, t * 0.3 + this.seed);
  this.a = n * TWO_PI * 2 + random(-0.05, 0.05); // Add jitter
  let r = 3 + this.lay * 2;
  this.pos.x = this.origin.x + cos(this.a) * r + random(-this.jitter, this.jitter);
  this.pos.y = this.origin.y + sin(this.a) * r + random(-this.jitter, this.jitter);
   }
 }


 show() {
   let r, g, b;

   if (this.ink) {
   // When in ink mode: grayscale, noise-based
  let n = noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01);
  let gray = n * 255;
  if (random() > 0.5) {
  r = g = b = gray * 0.2 + random(10, 30);  // Dark ink
  } else {
  r = g = b = gray * 0.9 + random(20, 40);  // Light ink
     }
  } else {
   // Normal color mode with slight RGB noise
  r = constrain(red(this.col) + random(-5, 5), 0, 255);
  g = constrain(green(this.col) + random(-4, 4), 0, 255);
  b = constrain(blue(this.col) + random(-5, 5), 0, 255);
  }


   let a = constrain(this.alpha + random(-10, 10), 80, 255); // Alpha flicker


   noStroke();
   fill(r, g, b, a);
   push();
   translate(this.pos.x, this.pos.y);
   rotate(this.a);
   ellipse(0, 0, this.len, this.wid);  // Draw the ellipse shape
   pop();
 }
}