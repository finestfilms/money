gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const startFrame = 20;
const endFrame = 150;
const frameCount = endFrame - startFrame + 1;

const images = [];
const seq = { frame: 0 };

/* === CANVAS SIZE === */

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawFrame(seq.frame);
}

window.addEventListener("resize", resizeCanvas);

/* === LOAD IMAGES === */

for (let i = 0; i < frameCount; i++) {
  const frameNumber = startFrame + i;

  const img = new Image();
  img.src = `frames/${String(frameNumber).padStart(4, "0")}.png`;

  images.push(img);
}

images[0].onload = () => {
  resizeCanvas();
};

/* === DRAW === */

function drawFrame(index) {
  const img = images[index];
  if (!img) return;

  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // "cover" scaling (fill width/height fully)
  const scale = Math.max(
    canvasWidth / img.width,
    canvasHeight / img.height
  );

  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;

  // Center horizontally
  const x = (canvasWidth - drawWidth) / 2;

  // How much the image overflows vertically
  const overflowY = drawHeight - canvasHeight;
  
  // Shift down 40% of the overflow
  const y = -(overflowY * 0.40);

  ctx.drawImage(img, x, y, drawWidth, drawHeight);
}

/* === SCROLL → FRAMES === */

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#cutscene",
    start: "top top",
    end: "+=320%", // how long the whole scene lasts
    scrub: true,
    pin: true
  }
});

// 1️⃣ Play the frame sequence
tl.to(seq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  onUpdate: () => drawFrame(seq.frame)
}, 0);

// 2️⃣ Fade in the title near the end
tl.to("#title", {
  opacity: 1,
  y: 0,
  ease: "power1.out"
}, 0.95); // appears at 80% of scroll

