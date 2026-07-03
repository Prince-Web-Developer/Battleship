class Ship {
  #hits;
  constructor(x, y, name, length, turn = false) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.length = length;
    this.#hits = 0;
    this.turn = turn;

    this.space = new Set();
    for (let index = 0; index < this.length; index++) {
      turn
        ? this.space.add(JSON.stringify([this.x, this.y + index]))
        : this.space.add(JSON.stringify([this.x + index, this.y]));
    }
  }

  hit() {
    this.#hits += 1;
  }

  isSunk() {
    return this.#hits >= this.length;
  }
}

class Gameboard {
  constructor() {
    this.boardSize = 8;
    this.gameBoard = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null),
    );
    this.ships = [];
    this.missedShots = [];
  }

  placeShipe(name, length, x, y, turn = false) {
    if (
      length > this.boardSize ||
      length <= 0 ||
      (turn && length + y > this.boardSize) ||
      (!turn && length + x > this.boardSize)
    )
      throw new Error("inappropriate length or cords");
    const stringVersionOfCords = JSON.stringify([x, y]);
    this.ships.forEach((ship) => {
      if (ship.space.has(stringVersionOfCords))
        throw new Error(`${name} can't be placed as ${ship.name} is there.`);
    });
    try {
      const newShip = new Ship(x, y, name, length, turn);
      this.ships.push(newShip);
    } catch (error) {
      console.log(error);
    }
  }

  receiveAttack(x, y) {
    const stringVersionOfCords = JSON.stringify([x, y]);
    if (this.gameBoard[x][y] !== null)
      throw new Error("position already attacked");
    this.gameBoard[x][y] = 0;
    for (let index = 0; index < this.ships.length; index++) {
      const ship = this.ships[index];
      if (ship.space.has(stringVersionOfCords)) {
        ship.hit();
        return true;
      }
    }
    this.missedShots.push([x, y]);
    return false;
  }

  sunkShips() {
    const sunkShips = [];

    this.ships.forEach((ship) => {
      if (ship.isSunk()) sunkShips.push(ship.name);
    });
    if (sunkShips.length === this.ships.length) return "Game Over";

    return sunkShips;
  }
}

export { Ship, Gameboard };
