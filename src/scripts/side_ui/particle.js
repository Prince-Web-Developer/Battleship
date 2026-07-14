
let particles = []




function addNewParticles(e) {
    for (let index = 0; index < 5; index++) {
      particles.push(new Particle(e.x, e.y));
    }
}


class Particle{
    constructor(x,y) {
        this.x = x
        this.y = y

        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
    }

    update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.1
    }

    draw(ctx) {
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 360)
        ctx.fill()
    }
}


function showParticles(ctx) {
    for (let index = particles.length - 1; index >= 0; index--) {
      const particle = particles[index];
      particle.update();

      if (particle.size < 0.2) {
        particles.splice(index, 1);
        continue;
      }

      particle.draw(ctx);
    }
}


export {showParticles,addNewParticles}




