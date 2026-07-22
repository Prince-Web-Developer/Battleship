import { GameManager, Gameboard } from "./class.js";
import { shipsBoard } from "./side_ui/shipBoard.js";
import { sounds } from "./sound.js";

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
    });


    helperUiMethods.addEventListener(document, "customMousUp", (e) => {
      const details = e.detail
        const ship = details.activeShip;
        const board = this.gameManager.activePlayer === this.gameManager.player1 ? gameUi.player1Board : gameUi.player2Board

        if (!ship) return;

        let target = details.target;
        if (!target){
          const x = ship.dataset.x
          const y = ship.dataset.y
          if (!x || !y) return
          target = board.querySelector(`[data-x="${x}"][data-y="${y}"]`)
        }
        const cords = target.dataset;
        const shipDataset = ship.dataset
        const turn = shipDataset.turn === "1" ? true : false

        const place = details.place
        

        
        if (
          !board.contains(target)
        ) {
          shipsBoard.resetShip(ship);
          sounds["no"].play().catch((e) => console.log(e))
          return;
        }
        
        this.gameManager.activePlayer.gameboard.placeShipe(shipDataset.name,+shipDataset.holes,+cords.x,+cords.y,turn,place)

        if (place) {
          sounds["place"].play().catch((e) => console.log(e))
          this.updateScreen()
          return
        }
         const data = {
          "ship": ship,
          "x": cords.x,
          "y": cords.y
         }

        const shipPlaced = new CustomEvent("placeShip",{
          detail: data
        })

        document.dispatchEvent(shipPlaced)
        this.adjustShip(target, ship,turn);
      },(e) => {
        const ship = e.detail.activeShip
        shipsBoard.resetShip(ship)
      });
  }

  adjustShip(cell, ship,turn) {
    const shipBounds = ship.getBoundingClientRect()
    const cellBounds = cell.getBoundingClientRect()
    const close = turn ? "top" : "left"
    const center = turn ? "left" : "top"

    const centerDistance = `${(cellBounds[center] + (turn ? cellBounds.width : window.scrollY)) + (turn ? (cellBounds.width - shipBounds.width) : (cellBounds.height - shipBounds.height))/2}px`
    ship.style[close] = `${cellBounds[close] + (turn ? window.scrollY : 0)}px`
    ship.style[center] = centerDistance
  }


  attack(e, board) {
    const target = e.target;
    if (!target.classList.contains("cell")) return;
    if (!this.checkIfWrongBoard(board, false)) return;
    const dataset = target.dataset;
    this.gameManager.receiveAttack(dataset.x, dataset.y);
    this.updateScreen();
  }

  checkIfWrongBoard(board, sameBoard) {
    let b1 = sameBoard ? "b1" : "b2";
    let b2 = sameBoard ? "b2" : "b1";
    
    if (this.gameManager.activePlayer === this.gameManager.player1 &&
        board.classList.contains(b1) || this.gameManager.activePlayer === this.gameManager.player2 &&
        board.classList.contains(b2) ) {return board}
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

  static addEventListener(element, type, callback, errCallback = (e) => {}) {
    element.addEventListener(type, (e) => {
      try {
        callback(e);
      } catch (error) {
        errCallback(e);
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

helperUiMethods.loadEventListener();

// to laod ships and on and off ship Board

export { gameUi };
