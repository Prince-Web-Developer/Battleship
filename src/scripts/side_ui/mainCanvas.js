import { showParticles } from "./particle.js";
import ship, { drawShips } from "./ship.js";
import { getWindowHeight,getWindowWidth } from "./window.js";


let canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = getWindowWidth();
  canvas.height = getWindowHeight();
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);





function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

  drawShips(ctx)
  showParticles(ctx)
  requestAnimationFrame(animate);
}

animate();
