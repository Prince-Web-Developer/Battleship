import css from "./style.css";
import mainCanvas from "./scripts/side_ui/mainCanvas.js";
import navigation from "./scripts/side_ui/navigation.js";
import demo, { gameUi} from "./scripts/game_ui.js";
import audio from "./scripts/sound.js" 
import { GameManager } from "./scripts/class.js";


document.querySelector("#gameMode").addEventListener("submit", (e) => {
  e.preventDefault();

  const gameMode = e.submitter.value;
  
  new gameUi(gameMode);
});


