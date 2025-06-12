# Dove in the Dream – Meditation  
**Perlin noise and randomness**  
**Group D**  
**Name** | **Unikey**  
--- | ---  
Quella He | xihe0819  

---

## How to Interact
- Move your mouse across the canvas to interact with the dove’s body.
- Brushstroke particles flow using Perlin noise and jitter with randomness.
- Hover over parts of the dove and you’ll trigger a black-and-white “ink wash” mode.
- The brush strokes dynamically react to mouse distance, returning to original positions after.
- Watch how the subtle color and motion effects are driven by both `random()` and `noise()`.

---

##  My Individual Animation Approach

This animation focuses on visualizing **Perlin noise** and **randomness** through a flow of particles sampled from an image of a dove.

My personal goals were:
- Use **Perlin noise** to create fluid, organic motion for each stroke.
- Apply **random()** during initialization to assign unique traits like length, width, angle, alpha.
- Add slight **RGB color jittering** for visual texture while keeping the form elegant.
- Create a **hover-based ink interaction** that transforms color to monochrome and simulates a “scatter effect”.

---

##  Animation Driver

- **Main Driver:** `noise()` function for flow direction and angle updates  
- **Secondary Driver:** `random()` for jitter, flicker, individual differences  
- **Interaction Driver:** `mouse position` to trigger ink mode and flow reactions  

---

##  Animated Properties

| Property            | Behaviour                                                                 | Unique Compared to Group      |
|---------------------|---------------------------------------------------------------------------|--------------------------------|
| Brush motion        | Flows with Perlin noise; wiggles with random jitter                       | Fully Perlin-driven with jitter |
| Color variation     | Subtle RGB noise, flickers slightly                                       | More restrained than others    |
| Ink effect          | Black-white ink when mouse is nearby                                     | Only triggers on hover         |
| Particle geometry   | Each stroke has random length, angle, transparency                        | Individually randomized         |
| Return animation    | Strokes return smoothly with `lerp()` after interaction                   | Transition uses noise + lerp   |

---

## Inspiration

### Inspired Works
#### 1. “Halo Dot” Series by Nan Qi  
![Nan Qi - Halo Dot](https://files.ocula.com/ri/f2/f26953c9-ff62-426a-86a1-246ffe1ba0a5/1600/536/3-coloured-halo-dots-by-nan-qi.webp)  
**Artist**: Nan Qi (China)  
Nan Qi is a contemporary Chinese artist known for his "halo dots", which resemble ink seals or digital pixels. He creates them by precisely controlling ink absorption on xuan paper. This visual rhythm and dot-based structure inspired the way I built motion layers from image pixels.

#### 2.Simulated Ink Brush Pressure
Simulates pressure-sensitive ink flow on canvas using random and noise distortions：https://openprocessing.org/sketch/984328
This inspired how I control the “ink mode” brush shapes and opacity.

For my version, I wanted to create a calm and poetic feeling, like a piece of traditional Chinese ink painting slowly coming alive. Instead of fast or dramatic animations, I focused on smooth flow, subtle motion, and layered textures.
By combining the influences with our group’s dove shape and motion base, I tried to create something that felt meditative, slightly mysterious, and very “Chinese” in spirit.

---

## Group Artwork Reference
Based on the image **"Dove of Peace" by Pablo Picasso** (not part of the official artwork list but used for code development).

---

## Technical Explanation

- **Perlin noise:** Used to calculate flow angle and smooth motion over time.
- **Random values:** Control initial position offset, length, width, angle, color variation, and transparency.
- **Mouse repulsion:** When near a stroke, it gets pulled away in a circular pattern and turns into ink mode.
- **Lerp:** Once the mouse leaves, each stroke gently returns to its original place.

---

## Tools & External Techniques

- **ChatGPT** I used ChatGPT as a brainstorming and technical support tool. Specifically, I:
Iterated with ChatGPT to debug certain visual behaviors such as stroke return motion and hover-triggered modes.
Received assistance formatting this README and references into a more academic and professional structure.
While I adapted and rewrote all code and descriptions myself.
- **p5.js** (https://p5js.org)


## Reference
Nan Qi. (n.d.). 3 Coloured Halo Dots. Wikimedia Commons. https://en.wikipedia.org/wiki/Nan_Qi_(artist)
OpenProcessing. (n.d.). Simulated Ink Brush Pressure. https://openprocessing.org/sketch/984328
p5.js. (n.d.). p5.js reference. Processing Foundation. https://p5js.or