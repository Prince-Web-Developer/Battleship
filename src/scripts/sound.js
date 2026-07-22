// import selectAudio from "/asssets/sounds/select.m4a"
import mouseClick from "/asssets/sounds/universfield-computer-mouse-click-352734.mp3";
import no from "/asssets/sounds/no.mp3"
import select from "/asssets/sounds/select.mp3"
import place from "/asssets/sounds/place.mp3"


const mouseClickAudio = new Audio(mouseClick);
mouseClickAudio.load();


const noAudio = new Audio(no)
noAudio.load()

const selectAudio = new Audio(select)
selectAudio.load()


const placeAudio = new Audio(place)
placeAudio.load()


const sounds = {
    "mouse": mouseClickAudio,
    "no":noAudio,
    "select":selectAudio,
    "place":placeAudio
}

export {sounds}