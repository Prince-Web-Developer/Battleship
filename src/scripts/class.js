const ships = [
  { name: "carrier", length: 5 },
  { name: "battleship", length: 4 },
  { name: "submarine", length: 3 },
  { name: "destroyer", length: 3 },
  { name: "patrol", length: 2 },
];

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

  placeShipe(name, length, x, y, turn = false, place = true) {
    if (this.checkCord(x, y) || (turn && length + x > Gameboard.BOARD_SIZE) || (!turn && length + y > Gameboard.BOARD_SIZE)) throw new Error("invalid position");
    
      
    if (length > Gameboard.BOARD_SIZE || length <= 0)
      throw new Error("inappropriate length");

    if (this.checkShipCordsAndMark(length, x, y, turn))
      throw new Error(`${name} can't be placed as ship is there.`);

    if (place) {
      const newShip = new Ship(name, length);
      this.checkShipCordsAndMark(length, x, y, turn, newShip);
      this.ships.push(newShip);
      return true
    }
  }

  checkShipCordsAndMark(length, x, y, turn, ship = false) {
    for (let index = 0; index < length; index++) {
      const cords = !turn ? [x, y + index] : [x + index, y];
      const cell = this.gameboard[cords[0]][cords[1]];
      if (ship) this.gameboard[cords[0]][cords[1]] = ship;
      if (cell) return true;
    }
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
    if (
      x < 0 ||
      y < 0 ||
      x >= Gameboard.BOARD_SIZE ||
      y >= Gameboard.BOARD_SIZE
    )
      return true;
    return false;
  }

  sunkShips() {
    const sunkShips = [];

    this.ships.forEach((ship) => {
      if (ship.isSunk()) sunkShips.push(ship.name);
    });

    const gameOver =
      sunkShips.length >= this.ships.length && this.ships.length > 0;

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
    return this.gameboard.sunkShips();
  }
  receiveAttack(x, y) {
    return this.gameboard.receiveAttack(x, y);
  }
  placeShipe(name, length, x, y, turn,place) {
    return this.gameboard.placeShipe(name, length, x, y, turn,place);
  }
}

class Computer extends Player {
  static variations = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  constructor(name, allships) {
    super(name);
    this.remainingPlacesArray = [];
    this.remainingPlaces = new Map(
      Array.from({ length: 100 }, (_, i) => {
        this.remainingPlacesArray.push(i);
        return [i, i];
      }),
    );

    this.boardLength = Gameboard.BOARD_SIZE;
    this.attacks = new Set();
    this.lastShot = null;
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

  playTurn(oppenetBoard) {
    let key;

    const attacksValues = [...this.attacks.keys()];
    if (attacksValues.length > 0) {
      key = attacksValues.pop();
      this.attacks.delete(key);
    } else {
      this.lastShot = null;
      const randomIndex = this.getRandomValue(this.remainingPlacesArray.length);

      key = this.remainingPlacesArray[randomIndex];
    }

    const index = this.remainingPlaces.get(key);
    const lastElement = this.remainingPlacesArray.at(-1);
    this.remainingPlacesArray[index] = lastElement;

    this.remainingPlaces.set(lastElement, index);
    this.remainingPlaces.delete(key);

    this.remainingPlacesArray.pop();

    const [x, y] = this.generateCords(key);

    if (oppenetBoard[x][y]) {
      this.generateAdjanceCords(x, y);
      this.lastShot = [x, y];
    }

    return { x, y };
  }

  getRandomValue(max) {
    return Math.floor(Math.random() * max);
  }

  generateCords(number) {
    return [Math.floor(number / this.boardLength), number % this.boardLength];
  }

  generateAdjanceCords(x, y) {
    let newX;
    let newY;
    if (this.lastShot) {
      newX = this.lastShot[0] - x;
      newY = this.lastShot[1] - y;
    }

    for (let index = 1; index < 5; index++) {
      if (this.lastShot) {
        this.addToAttackArray(newX * index + x, newY * index + y);
        this.addToAttackArray(newX * index * -1 + x, newY * index * -1 + y);
      } else {
        const variation = Computer.variations[index - 1];
        this.addToAttackArray(variation[0] + x, variation[1] + y);
      }
    }
  }

  addToAttackArray(x, y) {
    const key = x * 10 + y;
    if (x < 10 && y < 10 && x >= 0 && y >= 0 && this.remainingPlaces.has(key)) {
      this.attacks.add(key);
    }
  }
}

class GameManager {
  constructor(gameMode) {

    this.length = gameMode === "two" ? ships.length * 2 : ships.length
    this.half = this.length / 2
    this.player1 = new Player("player1");
    this.player2 =
      gameMode === "two"
        ? new Player("player2")
        : new Computer("computer", ships);
    this.activePlayer = this.player1;
  }



  get start(){
    return this.length > 0 ? false : true
  }

  #changeActivePlayer() {
    this.activePlayer =
      this.activePlayer === this.player1 ? this.player2 : this.player1;
  }

  receiveAttack(x, y) {
    if (!this.start) throw new Error("place all ships");
    const playerRecevingAttack =
      this.activePlayer === this.player1 ? this.player2 : this.player1;
    playerRecevingAttack.receiveAttack(x, y);
    this.#changeActivePlayer();

    if (this.activePlayer instanceof Computer) this.fireComputerTurn()
    else if(this.player2.constructor === Player) this.firePassScreen()
  }

  fireComputerTurn(){
    const cords = this.activePlayer.playTurn(this.player1.gameboard.gameboard)
    const event = new CustomEvent("computerTurn",{
      detail: {x: cords.x,y : cords.y}
    })
    document.dispatchEvent(event)
  }

  firePassScreen() {
    const passScreen = new CustomEvent("passScreen")
    document.dispatchEvent(passScreen)
  }

  placeShipe(name, length, x, y, turn = false, place) {
    const placed = this.activePlayer.placeShipe(name, length, x, y, turn, place)
    if (placed) this.length = this.length - 1 
    if (this.player2.constructor === Player && this.length === this.half && placed) {
      this.#changeActivePlayer()
      this.firePassScreen()
    }
  }

  isGameOver() {
    const player1 = this.player1.sunkShips().gameOver
    const player2 = this.player2.sunkShips().gameOver
      
    if (player1) return this.player2.name
    if (player2) return this.player1.name
  }
}

export { Ship, Gameboard, Player, Computer, GameManager };
