import { Player, Gameboard } from "./class.js"



const player1Board = document.querySelector(".b1")
const player2Board = document.querySelector(".b2")
const boardLength = Gameboard.BOARD_SIZE




function setUp() {
    player1Board.innerHTML = ""
    player1Board.appendChild(createBoard())

    player2Board.innerHTML = ""
    player2Board.appendChild(createBoard())
}

setUp()




function createBoard() {
    const fragment = document.createDocumentFragment()

    for (let x = 0; x < boardLength; x++) {
        for (let y = 0; y < boardLength; y++) {
            const cell = document.createElement("div")
            cell.dataset.x = x
            cell.dataset.y = y
            fragment.appendChild(cell)
        }
    }
    return fragment
}
const shipsBoard = document.querySelector(".shipBoard")
const shipsBoardBtn = document.querySelector(".downArrow");
shipsBoardBtn.addEventListener("click", () => shipsBoard.classList.toggle("height40"));
