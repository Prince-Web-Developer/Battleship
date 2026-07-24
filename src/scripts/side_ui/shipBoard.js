import { ships } from "../shipImages.js";
import check from "/asssets/images/check.svg";
import rotate from "/asssets/images/rotate.svg";
import cancel from "/asssets/images/cross.svg";
import { sounds } from "../sound.js";

class ShipsUi {
  constructor() {
    this.cacheDom();
    this.loadEventListner();
    this.ships = [];
    this.buttonContainer = this.#makeButtons();
  }

  cacheDom() {
    this.shipsBoard = document.querySelector(".shipBoard");
    this.shipsBoardBtn = document.querySelector(".downArrow");
    this.innerBoard = document.querySelector(".boardInner");
    this.gameScreen = document.querySelector("#game");
  }

  init() {
    // we need show board here and fill ships in it
    this.activeShip = null;
    this.shipsBoard.classList.remove("none");
    this.#createShips();
  }

  end() {
    // all ships are place hide boar
    this.shipsBoard.classList.add("none");
    this.ships.forEach((ship) => {
      ship.remove();
    });

    this.ships = [];
  }

  resetShip(ship) {
    ship.classList.remove("absolute", "place", "rotate");
    ship.dataset.turn = "0";
    ship.remove(this.buttonContainer);
    const parent = this.innerBoard.querySelector(`.${ship.dataset.name}`);
    parent.insertBefore(ship, parent.lastElementChild);
    this.finishDragging(ship);
  }

  loadEventListner() {
    document.addEventListener("placeShip", this.markShip);
    document.addEventListener("pointerup", this.releaseCustomMouseUpEvent);
    this.shipsBoardBtn.addEventListener("click", () =>
      this.shipsBoard.classList.toggle("height40"),
    );
  }

  releaseCustomMouseUpEvent = (e, place = false) => {
    const data = {
      activeShip: this.activeShip,
      target: e.target,
      place: place,
    };

    const event = new CustomEvent("customMousUp", {
      detail: data,
    });
    document.dispatchEvent(event);
  };

  markShip = (e) => {
    const { ship, x, y } = e.detail;
    ship.dataset.x = x;
    ship.dataset.y = y;
    ship.classList.add("place");
    ship.addEventListener("click", this.showEditButtons);
    this.finishDragging(ship);
  };

  #createShips() {
    const fragment = document.createDocumentFragment();
    const cellWidth = document.querySelector(".cell").clientWidth;
    ships.forEach((ship) => {
      fragment.append(this.#createShip(ship, cellWidth));
    });

    this.innerBoard.innerHTML = "";
    this.innerBoard.append(fragment);
  }

  #createShip(ship, cellWidth) {
    const { name, length, img } = ship;
    const shipContainer = document.createElement("div");

    const shipName = document.createElement("h3");
    shipName.innerText = name;
    const shipImg = img.cloneNode(true);

    const height = cellWidth * length;
    shipImg.style.width = `${height}px`;
    shipImg.style.height = `${cellWidth}px`;

    const shipImgContainer = document.createElement("div");
    shipImgContainer.classList.add("shipImgContainer");
    shipImgContainer.append(shipImg);
    shipImgContainer.dataset.holes = length;
    shipImgContainer.dataset.name = name;

    shipImgContainer.addEventListener(
      "pointerdown",
      this.#selectShip.bind(this),
    );

    const holes = document.createElement("p");
    holes.innerText = `${length} holes`;

    shipContainer.append(shipName, shipImgContainer, holes);
    shipContainer.classList.add("ship", name);
    this.ships.push(shipContainer);
    return shipContainer;
  }

  #selectShip(event) {
    const target = event.currentTarget;
    if (target.classList.contains("place")) return;
    target.classList.add("absolute", "pointerNone");
    this.shipsBoard.classList.add("height40");
    this.activeShip = target;
    this.gameScreen.append(this.activeShip);
    this.#moveShip();
  }

  finishDragging(ship) {
    ship.classList.remove("pointerNone");
    document.removeEventListener("pointermove", this.mouseCoverFn);
    this.activeShip = null;
  }

  showEditButtons = (e) => {
    const target = e.currentTarget;
    if (target.contains(this.buttonContainer)) {
      this.buttonContainer.remove();
      return;
    }
    target.append(this.buttonContainer);
    sounds["select"]();
  };

  #makeButtons() {
    const rightButton = document.createElement("button");
    rightButton.id = "placeShip";

    const checkImg = document.createElement("img");
    checkImg.src = check;

    rightButton.append(checkImg);

    rightButton.addEventListener("click", this.done);

    const rotateButton = document.createElement("button");
    rotateButton.id = "rotateShip";

    const rotateImg = document.createElement("img");
    rotateImg.src = rotate;

    rotateButton.append(rotateImg);
    rotateButton.addEventListener("click", this.rotateShip);

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancelShip";

    const cancelImg = document.createElement("img");
    cancelImg.src = cancel;

    cancelButton.append(cancelImg);
    cancelButton.addEventListener("click", this.cancelShip);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttonCon");
    buttonsContainer.append(rightButton, rotateButton, cancelButton);

    return buttonsContainer;
  }

  done = (e) => {
    const ship = this.getShipFromEvent(e);
    ship.classList.add("pointerNone");
    this.activeShip = ship;
    this.releaseCustomMouseUpEvent({ target: null }, true);
    this.activeShip = null;
  };

  cancelShip = (e) => {
    this.resetShip(this.getShipFromEvent(e));
  };

  getShipFromEvent(event) {
    const rotateButton = event.currentTarget;
    return rotateButton.parentNode.parentNode;
  }

  rotateShip = (event) => {
    event.stopPropagation();
    const ship = this.getShipFromEvent(event);
    this.buttonContainer.remove();
    ship.dataset.turn = Number(ship.classList.toggle("rotate"));
    this.activeShip = ship;
    this.releaseCustomMouseUpEvent({ target: null });
  };

  mouseCoverFn = (e) =>{
    e.preventDefault()
    this.#changeShipCords(e.pageX, e.pageY);
  } 

  #moveShip() {
    document.addEventListener("pointermove", this.mouseCoverFn);
  }

  #changeShipCords(x, y) {
    if (!this.activeShip) return;

    this.activeShip.style.left = `${x}px`;
    this.activeShip.style.top = `${y}px`;
  }
}

const shipsBoard = new ShipsUi();

export { shipsBoard };
