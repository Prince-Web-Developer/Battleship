import { Ship } from "../src/scripts/class";

let tanker


beforeEach(() => {
    tanker = new Ship("tanker", 4);
})


test("ship instance is created properly", () => {
    expect(tanker.name).toBe("tanker")
    expect(tanker.isSunk()).toBe(false)
})

test("ship hit() method works properly", () => {
    for (let index = 0; index < 4; index++) {
        tanker.hit()
    }
    expect(tanker.isSunk()).toBe(true)
});

test("ship constructor called with length 0 throws error", () => {
    expect(() => new Ship("tanker", 0)).toThrow("Length should be more than 0");
});