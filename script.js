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

  // "cover" scaling (like CSS background-size: cover)
  const scale = Math.max(
    canvasWidth / img.width,
    canvasHeight / img.height
  );

  const x = (canvasWidth - img.width * scale) / 2;
  const y = (canvasHeight - img.height * scale) / 2;

  ctx.drawImage(
    img,
    x,
    y,
    img.width * scale,
    img.height * scale
  );
}

/* === SCROLL → FRAMES === */

gsap.to(seq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: "#cutscene",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true
  },
  onUpdate: () => drawFrame(seq.frame)
});

/* === TITLE APPEAR === */

gsap.to("#title", {
  opacity: 1,
  y: -30,
  scrollTrigger: {
    trigger: "#cutscene",
    start: "60% center",
    end: "80% center",
    scrub: true
  }
});

