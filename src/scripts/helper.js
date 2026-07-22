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

  static showError(error) {
    helperUiMethods.errors.innerText = error.message;
    helperUiMethods.errors.classList.add("errorAnimation");
  }
}

helperUiMethods.loadEventListener();


export{helperUiMethods}