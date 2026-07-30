class helperUiMethods {
  static errors = document.querySelector(".errors");
  static modal = document.querySelector("#gameOverScreen")
  static winnerCon = document.querySelector("#winner")
  static modalCloseBtn = document.querySelector(".closeModal")

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
    helperUiMethods.addEventListener(window, "popstate", () => {
      if (helperUiMethods.modal.open) helperUiMethods.modalCloseBtn.click()
    })
    helperUiMethods.addEventListener(helperUiMethods.modalCloseBtn,"click",() => helperUiMethods.modal.close())
  }

  static loadVideoEvents(video, container, callbackAfterPlaying) {
    let temp = video.querySelectorAll("source");
    const sources = temp ? temp : [video];
    sources.forEach((source) => {
      helperUiMethods.addEventListener(source, "error", () => callbackAfterPlaying(container));
    });
    helperUiMethods.addEventListener(video, "ended", () => callbackAfterPlaying(container));
    
  }

  static showError(error) {
    helperUiMethods.errors.innerText = error.message;
    helperUiMethods.errors.classList.add("errorAnimation");
  }




  static showModal(winner){
    helperUiMethods.winnerCon.innerText = `${winner} Won`
    helperUiMethods.modal.showModal()
  }
}

helperUiMethods.loadEventListener();

export { helperUiMethods };
