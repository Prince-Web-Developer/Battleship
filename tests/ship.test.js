import { Ship } from "../src/scripts/class";

let tanker


beforeEach(() => {
    tanker = new Ship(4,4,"tanker", 4);
})


test("ship instance is created properly", () => {
    expect(tanker.x).toBe(4)
    expect(tanker.y).toBe(4)
    expect(tanker.name).toBe("tanker")
    expect(tanker.isSunk()).toBe(false)
    expect(tanker.turn).toBe(false);
})

test("ship hit() method works properly", () => {
    for (let index = 0; index < 4; index++) {
        tanker.hit()
    }
    expect(tanker.isSunk()).toBe(true)
});



test("ship space array is populated corrlectly", () => {
    expect(tanker.space.has(JSON.stringify([4,4]))).toBe(true)
    expect(tanker.space.has(JSON.stringify([5,4]))).toBe(true)
    expect(tanker.space.has(JSON.stringify([6,4]))).toBe(true)
    expect(tanker.space.has(JSON.stringify([7,4]))).toBe(true)
    expect(tanker.space.has(JSON.stringify([8,4]))).toBe(false)
})