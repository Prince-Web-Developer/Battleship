import { Gameboard } from "../src/scripts/class";

let gameBoard;
beforeAll(() => {
  gameBoard = new Gameboard();
});

test("gameboard is created with all its indexs been array with null value", () => {
  const board = gameBoard.gameboard;
  board.forEach((row) => {
    row.forEach((cell) => expect(cell).toBe(null));
  });
});

test("gameboard can place ships", () => {
  gameBoard.placeShipe("tanker", 4, 3, 3);
  expect(gameBoard.ships[0].name).toBe("tanker");
  expect(gameBoard.ships[0].length).toBe(4);
});

test("gameboard can place multiple ships", () => {
  gameBoard.placeShipe("carrier", 2, 1, 1, true);
  expect(gameBoard.ships[1].name).toBe("carrier");
  expect(gameBoard.ships[1].length).toBe(2);
});

test("gameboard can't place ship on location where existing ship is there", () => {
  expect(() => gameBoard.placeShipe("submarie", 4, 4, 3)).toThrow(
    "submarie can't be placed as tanker is there.",
  );
});

test("gameboard can't place ship outside the board", () => {
  expect(() => gameBoard.placeShipe("submarie", 6, 2, 6, true)).toThrow(
    "invalid position",
  );
});

test("gameboard receiveAttack works", () => {
  gameBoard.receiveAttack(7, 7);
  expect(gameBoard.attackedPlaces.has('[7,7]')).toBe(true);
});

test("gameboard receive attack can't receive attack for same position", () => {
  expect(() => gameBoard.receiveAttack(7, 7)).toThrow(
    "position already attacked",
  );
});

test("gameboard receive attack throws error when invalid position is provided", () => {
  expect(() => gameBoard.receiveAttack(-1, 2)).toThrow("invalid position");
})

test("gameboard receive attack works on ships", () => {
  gameBoard.receiveAttack(1, 1);
  gameBoard.receiveAttack(1, 2);
  expect(gameBoard.sunkShips().sunkShips[0]).toBe("carrier");
});

