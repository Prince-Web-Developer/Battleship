import { Gameboard } from "../src/scripts/class";

let gameBoard;
beforeAll(() => {
  gameBoard = new Gameboard();
});

test("gameboard is created with all its indexs been array with null value", () => {
  const board = gameBoard.gameBoard;
  board.forEach((row) => {
    row.forEach((cell) => expect(cell).toBe(null));
  });
});

test("gameboard can place ships", () => {
  gameBoard.placeShipe("tanker", 4, 3, 3);
  expect(gameBoard.ships[0].name).toBe("tanker");
  expect(gameBoard.ships[0].length).toBe(4);
  expect(gameBoard.ships[0].x).toBe(3);
  expect(gameBoard.ships[0].y).toBe(3);
  expect(gameBoard.ships[0].turn).toBe(false);
});

test("gameboard can place multiple ships", () => {
  gameBoard.placeShipe("carrier", 2, 1, 1, true);
  expect(gameBoard.ships[1].name).toBe("carrier");
  expect(gameBoard.ships[1].length).toBe(2);
  expect(gameBoard.ships[1].x).toBe(1);
  expect(gameBoard.ships[1].y).toBe(1);
  expect(gameBoard.ships[1].turn).toBe(true);
});

test("gameboard can't place ship on location where existing ship is there", () => {
  expect(() => gameBoard.placeShipe("submarie", 4, 4, 3)).toThrow(
    "submarie can't be placed as tanker is there.",
  );
});

test("gameboard can't place ship outside the board", () => {
  expect(() => gameBoard.placeShipe("submarie", 6, 2, 6, true)).toThrow(
    "inappropriate length or cords",
  );
});

test("gameboard missed shot array is updated when attack is missed", () => {
  gameBoard.receiveAttack(7, 7);
  expect(gameBoard.missedShots[0]).toEqual([7, 7]);
});

test("gameboard receive attack can't receive attack for same position", () => {
  expect(() => gameBoard.receiveAttack(7, 7)).toThrow(
    "position already attacked",
  );
});

test("gameboard receive attack works on ships", () => {
  expect(gameBoard.receiveAttack(1, 1)).toBe(true);
  expect(gameBoard.receiveAttack(1, 2)).toBe(true);
});

test("gameboard sunkship contain carrier", () => {
  expect(gameBoard.sunkShips()[0]).toBe("carrier");
});
