import css from "./style.css";
import mainCanvas from "./scripts/side_ui/mainCanvas.js"
import navigation from "./scripts/side_ui/navigation.js"
import demo from "./scripts/game_ui.js"
import { addNewParticles } from "./scripts/side_ui/particle.js";
import { resizeBoard } from "./scripts/game_ui.js";




document.addEventListener("pointermove", (e) => {
  addNewParticles(e)
  resizeBoard(e)
});

document.querySelector("#gameMode").addEventListener("submit", (e) => {
  e.preventDefault()

    const gameMode = e.submitter.value;
    
})