// main.js

const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');
let fc = 0;
const scf = 10; // scale factor for the butterfly
let W, H;

const setup = () => {
    [W, H] = setSize(canvas, ctx);
    animate();
};

const animate = () => {
    clear(ctx);
    
    let θ = fc / 60;
    let x, y, tempx, tempy;

    ctx.fillStyle = ctx.strokeStyle = `rgb(
        ${Math.abs(Math.sin(fc / 360)) * 255},
        ${Math.abs(Math.sin(fc / 360 + Math.PI / 6)) * 255}, 
        ${Math.abs(Math.sin(fc / 360 - Math.PI / 6)) * 255}
    )`;

    ctx.save();
    ctx.translate(W / 2, H / 2);

    tempx = x;
    tempy = y;

    let r = Math.pow(Math.E, Math.sin(θ)) - 2 * Math.cos(4 * θ) + Math.pow(Math.sin((2 * θ - Math.PI) / 24), 5);
    r *= scf;
    x = r * Math.cos(θ);
    y = -r * Math.sin(θ);

    line(ctx, x, y, tempx, tempy);
    ctx.restore();

    fc++;
    window.requestAnimationFrame(animate);
};

const clear = (ctx = canvas.getContext('2d'), color = "rgba(0, 0, 0, 1)", w = window.innerWidth, h = window.innerHeight) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
};

const line = (ctx = canvas.getContext('2d'), x1 = 0, y1 = 0, x2 = 100, y2 = 100) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const setSize = (c = canvas, ctx = canvas.getContext('2d'), w = window.innerWidth, h = window.innerHeight, pd = window.devicePixelRatio) => {
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    
    c.width = w * pd;
    c.height = h * pd;
    
    ctx.scale(pd, pd);

    return [w, h];
};

window.onload = setup;