import { Player, Computer } from "../src/scripts/class";

function createShipObject(name, length, x, y, turn = false) {
  return { name, length, x, y, turn };
}

let computer;


beforeAll(() => {
  const player = new Player();
  player.placeShipe("patrolBoat", 2, 7, 5);
  computer = new Computer([createShipObject("tanker",5,3,3)], player.gameboard.gameboard);
});

describe("play function", () => {
  test("returns value in right format", () => {
    const spy = jest.spyOn(computer, "getRandomValue").mockReturnValueOnce(75);
    expect(computer.playTurn()).toEqual({ x: 7, y: 5 });
    spy.mockRestore();
  });

  test("after a ship is found adjance shot is return", () => {
    const adjanceShots = ["7,4", "7,6", "6,5", "8,5"];

    for (let index = 0; index < 4; index++) {
      const result = computer.playTurn();
      const resultInStringFormat = `${result.x},${result.y}`;
      expect(adjanceShots).toContain(resultInStringFormat);
    }
  });
});
