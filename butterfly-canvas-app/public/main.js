const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
let W, H, scf, θ = 0, fid;
const totalSteps = 360 * 6;
let currentStep = 0;
let prevX = 0, prevY = 0;

const duration = 15 * 1000; // 15 seconds in ms
let startTime = null;

function setSize() {
  const pd = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  canvas.width = W * pd;
  canvas.height = H * pd;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.scale(pd, pd);
  scf = Math.min(W, H) / 8;
}

function clear(color = "rgba(0,0,0,1)") {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
}

function line(x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function getColor(i) {
  return `rgb(
    ${Math.abs(Math.sin(i / 360)) * 255},
    ${Math.abs(Math.sin(i / 360 + Math.PI / 6)) * 255},
    ${Math.abs(Math.sin(i / 360 - Math.PI / 6)) * 255}
  )`;
}

function animate(timestamp) {
  if (currentStep === 0) {
    clear();
    ctx.save();
    ctx.translate(W / 2, H / 2);
    // Initialize first point
    θ = 0;
    let r = Math.exp(Math.sin(θ)) - 2 * Math.cos(4 * θ) + Math.pow(Math.sin((2 * θ - Math.PI) / 24), 5);
    r *= scf;
    prevX = r * Math.cos(θ);
    prevY = -r * Math.sin(θ);
    ctx.restore();
    startTime = timestamp;
  }

  ctx.save();
  ctx.translate(W / 2, H / 2);

  // Calculate how many steps to draw this frame
  let elapsed = timestamp - startTime;
  let targetStep = Math.floor((elapsed / duration) * totalSteps);
  targetStep = Math.min(targetStep, totalSteps);

  for (; currentStep < targetStep; currentStep++) {
    θ = currentStep * Math.PI / 180 / 6;
    let r = Math.exp(Math.sin(θ)) - 2 * Math.cos(4 * θ) + Math.pow(Math.sin((2 * θ - Math.PI) / 24), 5);
    r *= scf;
    let x = r * Math.cos(θ);
    let y = -r * Math.sin(θ);

    let color = getColor(currentStep);
    if (currentStep > 0) line(prevX, prevY, x, y, color);

    prevX = x;
    prevY = y;
  }

  ctx.restore();

  if (currentStep < totalSteps) {
    fid = window.requestAnimationFrame(animate);
  }
}

window.onload = () => {
  setSize();
  currentStep = 0;
  window.requestAnimationFrame(animate);
};

window.onresize = () => {
  setSize();
  currentStep = 0;
  window.requestAnimationFrame(animate);
};