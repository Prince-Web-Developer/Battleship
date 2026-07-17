import { ships } from "./shipImages.js";
import { GameManager, Gameboard } from "./class.js";

class gameUi {
  static player1Board = document.querySelector(".b1");
  static player2Board = document.querySelector(".b2");
  static turn = document.querySelector(".turn");

  constructor(gameMode) {
    this.gameManager = new GameManager(gameMode);
    this.updateScreen();
    this.loadEventListener();
  }

  updateScreen() {
    const winner = this.gameManager.isGameOver();
    if (winner) {
      console.log(winner);
    }
    this.createBoard(this.gameManager.player1, gameUi.player1Board);
    this.createBoard(this.gameManager.player2, gameUi.player2Board);
    if (this.gameManager.start)
      gameUi.turn.innerText = `${this.gameManager.activePlayer.name} turns`;
    else gameUi.turn.innerText = "Place your ships";
  }

  loadEventListener() {
    const boards = document.querySelectorAll(".board");

    boards.forEach((board) => {
      helperUiMethods.addEventListener(board, "click", (e) =>
        this.attack(e, board),
      );

      helperUiMethods.addEventListener(document, "pointerup", (e) => {
        const cell = e.target
        if (cell.classList.contains("cell")) {
          const activateShip = shipsUi.activateShip
          if (!activateShip || this.checkIfWrongBoard(board,true)) return
          if (this.isWithinBounds(activateShip, board)) {
            const shipDataset = activateShip.dataset
            const cellDataset = cell.dataset
            this.gameManager.placeShipe(shipDataset.name, shipDataset.holes, cellDataset.x, cellDataset.y)
            shipsUi.markShip()
            shipsUi.reset(true)
            return
          }
        }
        shipsUi.reset(false)
      },() => shipsUi.reset(false))
    });
  }


  isWithinBounds(element, container) {
  const rect = element.getBoundingClientRect();
  const parentRect = container.getBoundingClientRect();

  return (
    rect.top >= parentRect.top &&
    rect.bottom <= parentRect.bottom &&
    rect.left >= parentRect.left &&
    rect.right <= parentRect.right
  );
}


  attack(e, board) {
    const target = e.target;
    if (!target.classList.contains("cell")) return;
    if (this.checkIfWrongBoard(board,false)) return;
    const dataset = target.dataset;
    this.gameManager.receiveAttack(dataset.x, dataset.y);
    this.updateScreen();
  }

  checkIfWrongBoard(board, sameBoard) {
    let b1 = 'b1'
    let b2 = 'b2'
    if (sameBoard) {
      b1 = 'b2'
      b2 = 'b1'
    }
    if (
      (this.gameManager.activePlayer === this.gameManager.player1 &&
        board.classList.contains(b1)) ||
      (this.gameManager.activePlayer === this.gameManager.player2 &&
        board.classList.contains(b2))
    )
      return true;
  }

  createBoard(player, gameBoardUi) {
    const fragment = document.createDocumentFragment();
    const length = Gameboard.BOARD_SIZE * Gameboard.BOARD_SIZE;

    for (let i = 0; i < length; i++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      const x = Math.floor(i / 10);
      const y = i % 10;

      div.dataset.x = x;
      div.dataset.y = y;

      // after the ship placing logic is done catch player gameboard
      const value = player.gameboard.gameboard[x][y];
      const isAttacked = player.gameboard.attackedPlaces.has(`[${x},${y}]`);

      if (isAttacked) div.classList.add(value ? "cross" : "dot");

      fragment.append(div);
    }
    gameBoardUi.innerHTML = "";
    gameBoardUi.append(fragment);
  }
}

class helperUiMethods {
  static errors = document.querySelector(".errors");

  static addEventListener(element, type, callback, errCallback = () => {}) {
    element.addEventListener(type, (e) => {
      try {
        callback(e);
      } catch (error) {
        errCallback();
        helperUiMethods.showError(error);
      }
    });
  }

  static loadEventListener() {
    helperUiMethods.errors.addEventListener("animationend", () => {
      helperUiMethods.errors.classList.remove("errorAnimation");
    });
  }

  static showError(error) {
    helperUiMethods.errors.innerText = error.message;
    helperUiMethods.errors.classList.add("errorAnimation");
  }
}

class shipsUi {
  static shipsBoard = document.querySelector(".shipBoard");
  static shipsBoardBtn = document.querySelector(".downArrow");
  static innerBoard = document.querySelector(".boardInner");
  static activateShip = null;

  constructor() {
    shipsUi.loadEventListener()
  }

  static loadEventListener() {
    shipsUi.shipsBoardBtn.addEventListener("click", () =>
      shipsUi.shipsBoard.classList.toggle("height40"),
    );
  }

  createShips() {
    const fragment = document.createDocumentFragment();
    ships.forEach((ship) => {
      const cellWidth = document.querySelector(".cell").clientWidth;
      const shipContainer = document.createElement("div");
      shipContainer.classList.add("ship");
      const shipName = document.createElement("h3");
      shipName.innerText = ship.name;
      const shipLength = ship.length;
      const shipImg = ship.img;

      shipImg.style.width = `${cellWidth * shipLength}px`;
      shipImg.style.height = `${cellWidth}px`;
      shipImg.dataset.holes = shipLength;
      shipImg.dataset.name = ship.name;
      helperUiMethods.addEventListener(shipImg, "pointerdown", shipsUi.selectShip);
      const holes = document.createElement("p");
      holes.innerText = `${shipLength} holes`;

      shipContainer.append(shipName, shipImg, holes);
      fragment.append(shipContainer);
    });

    shipsUi.innerBoard.append(fragment);
  }

  static selectShip(e) {
    const ship = e.target;
    if (ship.dataset.mark) return;
    shipsUi.activateShip = ship;
    shipsUi.activateShip.classList.remove("normalPosition")
    ship.style.position = "fixed";
    shipsUi.shipsBoard.classList.add("invisible");
    helperUiMethods.addEventListener(document, "pointermove", shipsUi.moveShip);
  }

  static markShip() {
    shipsUi.activateShip.dataset.mark = 1
  }

  static moveShip(e) {
    if (!shipsUi.activateShip) return;
    shipsUi.activateShip.style.top = `${e.clientY - 10}px`;
    shipsUi.activateShip.style.left = `${e.clientX - 10}px`;
  }

  static reset(shipPlaced) {
    if (!shipsUi.activateShip) return
    shipsUi.shipsBoard.classList.remove("invisible")
    if (!shipPlaced) shipsUi.activateShip.classList.add("normalPosition");
    document.removeEventListener("pointermove",shipsUi.moveShip)
  }
}



helperUiMethods.loadEventListener();

const shipsBoard = new shipsUi();
// to laod ships and on and off ship Board

export { gameUi, shipsBoard };
