class Ship {
  #hits;
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.#hits = 0;
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
    this.attackedPlaces = new Set();
  }

  placeShipe(name, length, x, y, turn = false) {
    if (
      this.checkCord(x, y) ||
      (turn && length + y > this.boardSize) ||
      (!turn && length + x > this.boardSize)
    )
      throw new Error("invalid position");
    if (length > this.boardSize || length <= 0)
      throw new Error("inappropriate length");

    const newShipCords = [];

    for (let index = 0; index < length; index++) {
      const cords = !turn ? [x + index, y] : [x, y + index];
      const cell = this.gameBoard[cords[0]][cords[1]];
      if (cell instanceof Ship)
        throw new Error(`${name} can't be placed as ${cell.name} is there.`);
      newShipCords.push(cords);
    }

    const newShip = new Ship(name, length);

    newShipCords.forEach(
      (cord) => (this.gameBoard[cord[0]][cord[1]] = newShip),
    );
    this.ships.push(newShip);
  }

  receiveAttack(x, y) {
    if (this.checkCord(x, y)) throw new Error("invalid position");
    if (this.attackedPlaces.has(`[${x},${y}]`))
      throw new Error("position already attacked");

    this.attackedPlaces.add(`[${x},${y}]`);

    const cell = this.gameBoard[x][y];
    if (cell instanceof Ship) {
      cell.hit();
      return cell;
    }
  }

  checkCord(x, y) {
    if (x < 0 || y < 0 || x >= this.boardSize || y >= this.boardSize) return true;
    return false;
  }

  sunkShips() {
    const sunkShips = [];

    this.ships.forEach((ship) => {
      if (ship.isSunk()) sunkShips.push(ship.name);
    });

    const gameOver = sunkShips.length >= this.ships.length;

    return {
      sunkShips,
      gameOver,
    };
  }
}


class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }

  sunkShips() {
    return this.gameboard.sunkShips()
  }
  receiveAttack(x,y) {
    return this.gameboard.receiveAttack(x,y)
  }
  placeShipe(name,length,x,y,turn) {
    return this.gameboard.placeShipe(name,length,x,y,turn)
  }
}

class Computer extends Player{
  constructor(name,allships) {
    super(name)
    this.placeAllShips(allships)
  }


  placeAllShips(allships) {
    let index = 0;
    const allShipsLength = allships.length;
    while (index < allShipsLength) {
      const randomX = Math.floor(Math.random() * 8);
      const randomY = Math.floor(Math.random() * 8);
      const turn = Boolean(Math.floor(Math.random() * 2));

      const ship = allships[index];
      try {
        this.placeShipe(ship.name, ship.length, randomX, randomY, turn);
        index++;
      } catch {
        continue;
      }
    }
  }
}





export { Ship, Gameboard, Player, Computer };
