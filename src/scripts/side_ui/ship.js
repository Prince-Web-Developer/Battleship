import { getWindowHeight, getWindowWidth } from "./window.js";


import { shipImages } from "../game_ui.js";

const MAXSHIPS = 3
const ships = []


const MAX_ROTATION = 320
const MIN_ROTATION = 220

const playSection = document.getElementById("play")

const celling = document.querySelector(".celling")


class Ship{
    constructor() {
        const cellingBounds = celling.getBoundingClientRect()
        this.x = randomNumber(cellingBounds.right - 100, cellingBounds.left + 100);
        this.y = 0;
        this.speed = 0.2
        this.img = shipImages[randomNumber(4, 0)];
        this.rotation = getAngleInRadian(randomNumber(MAX_ROTATION, MIN_ROTATION))
        this.dx = -Math.cos(this.rotation) * this.speed;
        this.dy = -Math.sin(this.rotation) * this.speed;
    }

    update() {
        this.x += this.dx
        this.y += this.dy
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        // 4. Rotate the canvas grid
        ctx.rotate(this.rotation);

        // 5. Draw the image offset by half its size to center it
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2, this.img.width, this.img.height);

        // 6. Restore the canvas matrix for future drawings
        ctx.restore();
    }
}

function getAngleInRadian(degree) {
    return degree * (Math.PI / 180)
}






const boundary = 50


function addNewShip() {
    if (playSection.classList.contains("none") || ships.length >= MAXSHIPS) return false
    const newShip = new Ship();
    ships.push(newShip);
    return true
}


function scheduleNextShip() {
  let delay = 0;
  if (addNewShip()) delay = randomNumber(7,3) * 10000
  setTimeout(scheduleNextShip, delay);
}

scheduleNextShip();

function drawShips(ctx) {
    if (playSection.classList.contains("none")) return 
    for (let index = ships.length - 1; index >= 0; index--) {
        const ship = ships[index];
        ship.update();
        if (ship.x <= -boundary || ship.x > getWindowWidth() + boundary || ship.y > getWindowHeight() + boundary) {
            ships.splice(index, 1)
            continue
        }
        ship.draw(ctx)
    }
}

function randomNumber(max,min) {
    return Math.floor(Math.random() * (max - min)) + min
}



export { drawShips }