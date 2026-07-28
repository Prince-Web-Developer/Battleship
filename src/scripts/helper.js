class helperUiMethods {
  static errors = document.querySelector(".errors");

  static addEventListener(element, type, callback, errCallback = (e) => {}) {
    element.addEventListener(type, (e) => {
      try {
        callback(e);
      } catch (error) {
        errCallback(e);
        helperUiMethods.showError(error);
      }
    });
  }

  static loadEventListener() {
    helperUiMethods.errors.addEventListener("animationend", () => {
      helperUiMethods.errors.classList.remove("errorAnimation");
    });
  }

  static playVideo(video, container, callbackAfterPlaying) {
    let temp = video.querySelectorAll("source");
    const sources = temp ? temp : [video];
    sources.forEach((source) => {
      helperUiMethods.addEventListener(source, "error", () => callbackAfterPlaying(container));
    });
    helperUiMethods.addEventListener(video, "ended", () => callbackAfterPlaying(container));
    container.classList.remove("none")
    video.play();
  }

  static showError(error) {
    helperUiMethods.errors.innerText = error.message;
    helperUiMethods.errors.classList.add("errorAnimation");
  }
}

helperUiMethods.loadEventListener();

export { helperUiMethods };
