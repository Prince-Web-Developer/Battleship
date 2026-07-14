import audio from "/asssets/sounds/universfield-computer-mouse-click-352734.mp3";

const mouseClickAudio = new Audio(audio);
mouseClickAudio.load();

const screens = document.querySelectorAll(".screen");

const pageFadeInAnimation = animateBody()
history.replaceState("intro", "", document.location.href);




const buttons = document.querySelectorAll(".navigationButton");
buttons.forEach((button) =>
    button.addEventListener("click", async (e) => {
        mouseClickAudio.play().catch((e) => console.log(e))
        setTimeout(() => {
            const screen = e.target.dataset.screenId
            history.pushState(screen, "", screen);
            pageFadeInAnimation.play()
            changeScreen(screen);
        }, 1000) // 1ms
  }),
);



window.addEventListener("popstate", (event) => {
  if (event.state) {
    changeScreen(event.state);
  }
});


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