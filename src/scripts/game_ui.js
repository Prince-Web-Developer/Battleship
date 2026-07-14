import { Player, Gameboard } from "./class.js"
import { getWindowHeight } from "./side_ui/window.js"


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

let resize = false
const shipBoard = document.querySelector(".shipBoard");
const downArrow = document
    .querySelector(".downArrow")



const resizeTrue = () => (resize = true);
const resizeFalse = () => (resize = false);


downArrow.addEventListener("mousedown",resizeTrue);
document.addEventListener("mouseup",resizeFalse)

downArrow.addEventListener("touchstart", resizeTrue);
document.addEventListener("touchend", resizeFalse);



function resizeBoard(e) {
    if (!resize) return
    const yCord = e.clientY
    const documentHeight = document.documentElement.clientHeight
    if (yCord < documentHeight * 0.2 || yCord > documentHeight - 40) return; 
    shipBoard.style.top = `${e.y}px`
} 


export {resizeBoard}