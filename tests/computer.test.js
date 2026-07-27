import { Player, Computer } from "../src/scripts/class";

function createShipObject(name, length, x, y, turn = false) {
  return { name, length, x, y, turn };
}


let player;
let computer;


beforeAll(() => {
  player = new Player();
  player.placeShipe("patrolBoat", 2, 7, 5);
  computer = new Computer("computer",[createShipObject("tanker",5,3,3)]);
});


describe("play function", () => {
  test("returns value in right format", () => {
    const spy = jest.spyOn(computer, "getRandomValue").mockReturnValueOnce(75);
    expect(computer.playTurn(player.gameboard.gameboard)).toEqual({ x: 7, y: 5 });
    spy.mockRestore();
  });

  test("after a ship is found adjance shot is return", () => {
    const adjanceShots = ["7,4", "7,6", "6,5", "8,5"];


      const result = computer.playTurn(player.gameboard.gameboard);
      const resultInStringFormat = `${result.x},${result.y}`;
      expect(adjanceShots).toContain(resultInStringFormat);
  });
});
