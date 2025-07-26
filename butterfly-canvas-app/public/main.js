const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
let W, H, scf, fc = 0, θ = 0, fid;

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

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function animate() {
  clear();
  ctx.save();
  ctx.translate(W / 2, H / 2);

  let tempx = 0, tempy = 0;
  for (let i = 0; i < 360 * 6; i++) {
    θ = i * Math.PI / 180 / 6;
    // Butterfly curve: r = e^sinθ - 2cos(4θ) + sin^5((2θ - π)/24)
    let r = Math.exp(Math.sin(θ)) - 2 * Math.cos(4 * θ) + Math.pow(Math.sin((2 * θ - Math.PI) / 24), 5);
    r *= scf;
    let x = r * Math.cos(θ);
    let y = -r * Math.sin(θ);

    ctx.strokeStyle = `rgb(
      ${Math.abs(Math.sin(i / 360)) * 255},
      ${Math.abs(Math.sin(i / 360 + Math.PI / 6)) * 255},
      ${Math.abs(Math.sin(i / 360 - Math.PI / 6)) * 255}
    )`;

    if (i > 0) line(tempx, tempy, x, y);
    tempx = x;
    tempy = y;
  }

  ctx.restore();
  fid = window.requestAnimationFrame(animate);
}

window.onload = () => {
  setSize();
  animate();
};

window.onresize = () => {
  setSize();
};