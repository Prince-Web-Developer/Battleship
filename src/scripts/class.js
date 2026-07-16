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
  static BOARD_SIZE = 10;
  constructor() {
    this.gameboard = Array.from({ length: Gameboard.BOARD_SIZE }, () =>
      Array(Gameboard.BOARD_SIZE).fill(null),
    );
    this.ships = [];
    this.attackedPlaces = new Set();
  }

  placeShipe(name, length, x, y, turn = false) {
    if (
      this.checkCord(x, y) ||
      (turn && length + y > Gameboard.BOARD_SIZE) ||
      (!turn && length + x > Gameboard.BOARD_SIZE)
    )
      throw new Error("invalid position");
    if (length > Gameboard.BOARD_SIZE || length <= 0)
      throw new Error("inappropriate length");

    const newShipCords = [];

    for (let index = 0; index < length; index++) {
      const cords = !turn ? [x + index, y] : [x, y + index];
      const cell = this.gameboard[cords[0]][cords[1]];
      if (cell instanceof Ship)
        throw new Error(`${name} can't be placed as ${cell.name} is there.`);
      newShipCords.push(cords);
    }

    const newShip = new Ship(name, length);

    newShipCords.forEach(
      (cord) => (this.gameboard[cord[0]][cord[1]] = newShip),
    );
    this.ships.push(newShip);
  }

  receiveAttack(x, y) {
    if (this.checkCord(x, y)) throw new Error("invalid position");
    if (this.attackedPlaces.has(`[${x},${y}]`))
      throw new Error("position already attacked");

    this.attackedPlaces.add(`[${x},${y}]`);

    const cell = this.gameboard[x][y];
    if (cell instanceof Ship) {
      cell.hit();
      return cell;
    }
  }

  checkCord(x, y) {
    if (x < 0 || y < 0 || x >= Gameboard.BOARD_SIZE || y >= Gameboard.BOARD_SIZE)
      return true;
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
  constructor() {
    this.gameboard = new Gameboard();
  }

  sunkShips() {
    return this.gameboard.sunkShips();
  }
  receiveAttack(x, y) {
    return this.gameboard.receiveAttack(x, y);
  }
  placeShipe(name, length, x, y, turn) {
    return this.gameboard.placeShipe(name, length, x, y, turn);
  }
}

class Computer extends Player {
  static variations = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  constructor(allships, oppenetBoard) {
    super();
    this.remainingPlacesArray = []
    this.remainingPlaces = new Map(Array.from({ length: 100 }, (_, i) => {
      this.remainingPlacesArray.push(i)
      return [i,i]
    }))
    this.oppenetBoard = oppenetBoard
    
    this.boardLength = Gameboard.BOARD_SIZE
    this.attacks = new Set()
    this.lastShot = null
    this.placeAllShips(allships);
  }

  placeAllShips(allships) {
    let index = 0;
    const allShipsLength = allships.length;
    while (index < allShipsLength) {
      const randomX = Math.floor(Math.random() * this.boardLength);
      const randomY = Math.floor(Math.random() * this.boardLength);
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



  playTurn() {

    let key

    const attacksValues = [...this.attacks.keys()]
    if (attacksValues.length > 0) {
      key = attacksValues.pop()
      this.attacks.delete(key)
    }
    else {
      this.lastShot = null
      const randomIndex = this.getRandomValue(this.remainingPlacesArray.length)
      
      key = this.remainingPlacesArray[randomIndex]
    }




    const index = this.remainingPlaces.get(key)
    const lastElement = this.remainingPlacesArray.at(-1);
    this.remainingPlacesArray[index] = lastElement
    
    this.remainingPlaces.set(lastElement, index)
    this.remainingPlaces.delete(key)   

    this.remainingPlacesArray.pop()


    const [x, y] = this.generateCords(key)
    
    if (this.oppenetBoard[x][y]) {
      this.generateAdjanceCords(x,y)
      this.lastShot = [x,y]
    }


    return {x,y}
  }

  getRandomValue(max) {
    return Math.floor(Math.random() * max);
  }

  generateCords(number) {
    return [Math.floor(number / this.boardLength),number % this.boardLength]
  }


  generateAdjanceCords(x, y) {

    let newX
    let newY
    if (this.lastShot) {
      newX = this.lastShot[0] - x;
      newY = this.lastShot[1] - y;
    }

    for (let index = 1; index < 5; index++) {
      if (this.lastShot) {
        this.addToAttackArray(newX * index + x, newY * index + y)
        this.addToAttackArray(newX * index * -1 + x, newY * index * -1 + y)
      }
      else {
        const variation = Computer.variations[index - 1];
        this.addToAttackArray(variation[0] + x, variation[1] + y)
      }
    }
  }


  addToAttackArray(x,y) {

      const key = x * 10 + y;
      if (
        x < 10 &&
        y < 10 &&
        x >= 0 &&
        y >= 0 &&
        this.remainingPlaces.has(key)
      ) {
        this.attacks.add(key);
      }
  }

}

export { Ship, Gameboard, Player, Computer };
