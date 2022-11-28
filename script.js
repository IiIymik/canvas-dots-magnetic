(() => {
  const config = {
    dotMinRad: 6,
    dotMaxRad: 20,
    massFactor: 0.0002,
    defColor: `rgba(250,10,30,0.9)`,
    smooth: 0.95,
    sphereRed: 300,
    bigDotRad: 35,
    mouseSize: 120,
  };
  const TWO_PI = 2 * Math.PI;
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  let w, h, mouse, dots;

  class Dot {
    constructor(r) {
      this.pos = { x: mouse.x, y: mouse.y };
      this.vel = { x: 0, y: 0 };
      this.rad = r || random(config.dotMinRad, config.dotMaxRad);
      this.mass = this.rad * config.massFactor;
      this.color = config.defColor;
    }
    draw(x, y) {
      this.pos.x = x || this.pos.x + this.vel.x;
      this.pos.y = y || this.pos.y + this.vel.y;
      createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
      createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
    }
  }

  function updateDots() {
    for (let i = 1; i < dots.length; i += 1) {
      let acc = { x: 0, y: 0 };
      for (let j = 0; j < dots.length; j += 1) {
        if (i === j) continue;
        let [a, b] = [dots[i], dots[j]];
        let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
        let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = ((dist - config.sphereRed) / dist) * b.mass;

        if (j == 0) {
          let alpha = config.mouseSize / dist;
          a.color = `rgba(250,10,30,${alpha})`;
          dist < config.mouseSize
            ? (force = (dist - config.mouseSize) * b.mass)
            : (force = a.mass);
        }
        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }
      dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
      dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
    }
    dots.map((e) => (e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw()));
  }

  function createCircle(x, y, rad, fill, color) {
    context.fillStyle = context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, rad, 0, TWO_PI);
    context.closePath();
    fill ? context.fill() : context.stroke();
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    mouse = { x: w / 2, y: h / 2, down: false };
    dots = [];

    dots.push(new Dot(config.bigDotRad));
  }

  function loop() {
    context.clearRect(0, 0, w, h);
    if (mouse.down) {
      dots.push(new Dot());
    }
    updateDots();

    window.requestAnimationFrame(loop);
  }

  init();
  loop();

  const random = (min, max) => Math.random() * (max - min) + min;

  const setPos = ({ layerX, layerY }) =>
    ([mouse.x, mouse.y] = [layerX, layerY]);

  const isDown = () => (mouse.down = !mouse.down);

  window.addEventListener("mousedown", isDown);
  window.addEventListener("mouseup", isDown);
  canvas.addEventListener("mousemove", setPos);
})();
