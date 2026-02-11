gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const frameCount = 131; // CHANGE THIS
const images = [];
const seq = { frame: 20 };

/* === CANVAS SIZE === */

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawFrame(seq.frame);
}

window.addEventListener("resize", resizeCanvas);

/* === LOAD IMAGES === */

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = `frames/frame_${String(i).padStart(4, "0")}.png`;
  images.push(img);
}

images[0].onload = () => {
  resizeCanvas();
};

/* === DRAW === */

function drawFrame(index) {
  const img = images[index];
  if (!img) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // cover behavior
  const scale = Math.max(
    canvas.width / img.width,
    canvas.height / img.height
  );

  const x = (canvas.width - img.width * scale) / 2;
  const y = (canvas.height - img.height * scale) / 2;

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

