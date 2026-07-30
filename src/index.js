import css from "./style.css";
import mainCanvas from "./scripts/side_ui/mainCanvas.js";
import navigation from "./scripts/side_ui/navigation.js";
import  {ui} from "./scripts/game_ui.js";
import audio from "./scripts/sound.js" 



document.querySelector("#gameMode").addEventListener("submit", (e) => {
  e.preventDefault();

  const gameMode = e.submitter.value;
  
  ui.init(gameMode)
});


