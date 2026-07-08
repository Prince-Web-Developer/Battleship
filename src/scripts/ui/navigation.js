import audio from "/asssets/sounds/universfield-computer-mouse-click-352734.mp3";

const mouseClickAudio = new Audio(audio);
mouseClickAudio.load();

const screens = document.querySelectorAll("body > div")

const pageFadeInAnimation = animateBody()




const buttons = document.querySelectorAll(".navigationButton");
buttons.forEach((button) =>
    button.addEventListener("click", async (e) => {
        mouseClickAudio.play().catch((e) => console.log(e))
        setTimeout(() => {
            pageFadeInAnimation.play()
            changeScreen(e.target.dataset.screenId);
        }, 1000) // 1ms
  }),
);


function changeScreen(newScreen) {
    screens.forEach((screen) => {
        if (screen.id === newScreen) screen.classList.remove("none")
        else screen.classList.add("none")
    })
}




function animateBody() {
    const keyFrames = [
        { opacity: 0 },
        {opacity: 1}
    ]
    const options = {
        fill: "forwards",
        duration: 500, // 0.5ms,
        easing: "ease-in"

    }
    return document.body.animate(keyFrames,options)
}