let doveImg;
let dots = [];

function preload() {
  // Load the dove image
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Use 1 display pixel per canvas pixel for accuracy

  // Resize image to width = 1000px, height is auto-calculated
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  // Centering the image on the canvas
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Loop through the image pixels and place a dot where it's dark
  for (let y = 0; y < doveImg.height; y += 3) {
    for (let x = 0; x < doveImg.width; x += 3) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];

      let brightness = (r + g + b) / 3;
      if (brightness < 50) {
        dots.push(new Dot(x + xOffset, y + yOffset)); // place dot with offset to center it
      }
    }
  }

  noStroke();
  fill(0);
}

function draw() {
  background(255); // white background
  let mouse = createVector(mouseX, mouseY); // get current mouse position as a vector

  // Update and display all the dots (particles)
  for (let dot of dots) {
    dot.update(mouse);
    dot.display();
  }
}

// Dot class: defines each moving point on the dove image
class Dot {
  constructor(x, y) {
    this.origin = createVector(x, y); // original position
    this.pos = this.origin.copy();    // current position
    this.vel = createVector(0, 0);    // current velocity
  }

  update(mouseVec) {
    let dir = p5.Vector.sub(this.pos, mouseVec); // direction from mouse to dot
    let d = dir.mag(); // distance

    // If close to mouse and mouse is pressed, push it away
    if (d < 80 && mouseIsPressed) {
      dir.setMag(1.2);     // control push strength
      this.vel.add(dir);   // apply the push
    }

    this.vel.mult(0.9);     // apply friction
    this.pos.add(this.vel); // update position

    // Slowly return to original position
    let back = p5.Vector.sub(this.origin, this.pos);
    back.mult(0.03);
    this.pos.add(back);
  }

  display() {
    ellipse(this.pos.x, this.pos.y, 2.8, 2.8); // draw the dot
  }
}