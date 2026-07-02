class Ship{
    #hits
    #length
    constructor(name, length) {
        if (length <= 0) throw new Error("Length should be more than 0")
        this.name = name
        this.#length = length
        this.#hits = 0
    }


    hit() {
        this.#hits += 1
    }

    isSunk() {
        return this.#hits >= this.#length
    }

}



export {Ship}