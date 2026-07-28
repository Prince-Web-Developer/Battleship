import { GameManager, Gameboard } from "./class.js";
import { shipsBoard } from "./side_ui/shipBoard.js";
import { sounds } from "./sound.js";
import { helperUiMethods } from "./helper.js";

class gameUi {
  static player1Board = document.querySelector(".b1");
  static player2Board = document.querySelector(".b2");
  static turn = document.querySelector(".turn");
  static countDownVideo = document.querySelector("#countDown");
  static countDownVideoContainer = document.querySelector(
    "#countDownContainer",
  );

  constructor(gameMode) {
    this.gameManager = new GameManager(gameMode);
    gameUi.turn.innerText = "Place your ships";
    this.createBoard(this.gameManager.player1, gameUi.player1Board);
    this.createBoard(this.gameManager.player2, gameUi.player2Board);
    this.loadEventListener();
  }

  updateScreen() {
    const winner = this.gameManager.isGameOver();
    if (winner) {
      console.log(winner);
    }

    const activePlayer = this.activePlayer();
    gameUi.turn.innerText = `${activePlayer.name} turns`;
    this.createBoard(activePlayer, this.giveActiveBoard());
  }

  loadEventListener() {
    helperUiMethods.addEventListener(gameUi.player1Board, "click", this.attack);
    helperUiMethods.addEventListener(gameUi.player2Board, "click", this.attack);

    helperUiMethods.addEventListener(
      document,
      "customMousUp",
      this.placeManager,
      (e) => {
        const ship = e.detail.activeShip;
        if (ship) {
          shipsBoard.resetShip(ship);
          sounds.no();
        }
      },
    );
  }

  placeManager = (e) => {
    const { activeShip: ship, target, place } = e.detail;
    if (!ship) return;

    const board = this.giveActiveBoard();
    const cell = this.getTargetCell(board, ship, target);

    if (!cell) return;

    if (!this.isTargetOnBoard(board, cell)) {
      throw new Error("No");
    }

    const turn = ship.dataset.turn === "1";

    this.placeShipOnBoard(ship, cell, turn, place);

    if (place) {
      this.finishPlacement();
      return;
    }

    this.previewPlacement(ship, cell, turn);
  };

  getTargetCell(board, ship, target) {
    if (target) return target;

    const { x, y } = ship.dataset;
    if (!x || !y) return null;

    return board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }

  isTargetOnBoard(board, target) {
    if (board.contains(target)) return true;

    return false;
  }

  placeShipOnBoard(ship, target, turn, place) {
    const { name, holes } = ship.dataset;
    const { x, y } = target.dataset;

    this.gameManager.placeShipe(
      name,
      Number(holes),
      Number(x),
      Number(y),
      turn,
      place,
    );
  }

  finishPlacement() {
    sounds.place();
    if (this.gameManager.start) this.startGame();
  }

  hideVideo = (videoCon) => {
    videoCon.classList.add("none");
    this.updateScreen()
  };

  startGame() {
    helperUiMethods.playVideo(gameUi.countDownVideo,gameUi.countDownVideoContainer,this.hideVideo)
  }

  previewPlacement(ship, target, turn) {
    document.dispatchEvent(
      new CustomEvent("placeShip", {
        detail: {
          ship,
          x: target.dataset.x,
          y: target.dataset.y,
        },
      }),
    );

    this.adjustShip(target, ship, turn);
  }

  adjustShip(cell, ship, turn) {
    const shipBounds = ship.getBoundingClientRect();
    const cellBounds = cell.getBoundingClientRect();
    const close = turn ? "top" : "left";
    const center = turn ? "left" : "top";

    const centerDistance = `${cellBounds[center] + (turn ? cellBounds.width : window.scrollY) + (turn ? cellBounds.width - shipBounds.width : cellBounds.height - shipBounds.height) / 2}px`;
    ship.style[close] = `${cellBounds[close] + (turn ? window.scrollY : 0)}px`;
    ship.style[center] = centerDistance;
  }

  attack = (e) => {
    const target = e.target;
    if (!target.classList.contains("cell")) return;
    if (this.giveActiveBoard().contains(target)) return;
    const dataset = target.dataset;
    this.gameManager.receiveAttack(dataset.x, dataset.y);
    this.updateScreen();
  };

  giveActiveBoard() {
    return this.activePlayer() === this.gameManager.player1
      ? gameUi.player1Board
      : gameUi.player2Board;
  }

  activePlayer() {
    return this.gameManager.activePlayer;
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

// to laod ships and on and off ship Board

export { gameUi };
