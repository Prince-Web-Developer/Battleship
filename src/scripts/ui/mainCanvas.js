import { showParticles } from "./particle.js";
import ship,{drawShips} from "./ship.js";


let canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
