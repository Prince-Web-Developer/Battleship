// import selectAudio from "/asssets/sounds/select.m4a"
import mouseClick from "/asssets/sounds/universfield-computer-mouse-click-352734.mp3";
import no from "/asssets/sounds/no.mp3"
import select from "/asssets/sounds/select.mp3"
import place from "/asssets/sounds/place.mp3"
import winterWind from "/asssets/sounds/winterWind.mp3"




const audioFiles = [
  { name: "mouse", audio: mouseClick },
  { name: "no", audio: no },
  { name: "select", audio: select },
  { name: "place", audio: place },
  { name: "winterWind",audio:winterWind },
];



const sounds = {
    
}



audioFiles.forEach((audio) => {
    const sound = new Audio(audio.audio)
    sound.load()
    sounds[audio.name] = (stop = false) => {
        try {
            if (stop) {
            sound.pause();
            return
           }
            sound.play()
        }
        catch (e) {
            console.log(e);
        }
        
    } 
})





export {sounds}