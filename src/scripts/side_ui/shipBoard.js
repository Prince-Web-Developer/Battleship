import { ships } from "../shipImages.js";
import check from "/asssets/images/check.svg" 
import rotate from "/asssets/images/rotate.svg"
import cancel from "/asssets/images/cross.svg"
import { sounds } from "../sound.js";

class shipsUi {

    #shipsBoard
    #shipsBoardBtn
    #innerBoard
    #gameScreen
    activeShip
    
  constructor() {
    this.#shipsBoard = document.querySelector(".shipBoard");
    this.#shipsBoardBtn = document.querySelector(".downArrow");
    this.#innerBoard = document.querySelector(".boardInner");
    this.#gameScreen = document.querySelector("#game")
    this.buttonContainer = this.#makeButtons()


    this.activeShip = null


    document.addEventListener("placeShip",this.markShip)
    






    document.addEventListener("mouseup",this.releaseCustomMouseUpEvent)
  }


  releaseCustomMouseUpEvent = (e,place = false) => {
    const data = {
      "activeShip": this.activeShip,
      "target": e.target,
      "place": place
    }

    const event = new CustomEvent("customMousUp",{
      detail: data
    })
    document.dispatchEvent(event)
  }

  markShip = (e) => {
    const ship = e.detail.ship
    const x = e.detail.x
    const y = e.detail.y


    ship.dataset.x = x
    ship.dataset.y = y
    ship.classList.add("place")
    ship.addEventListener("click",this.showEditButtons)
    this.placeShip(ship)
  }



    reset(){
        this.#loadEventListener()
        this.#createShips()
    }

    #loadEventListener() {
    this.#shipsBoardBtn.addEventListener("click", () =>
      this.#shipsBoard.classList.toggle("height40"),
    );
  }

  #createShips() {
    const fragment = document.createDocumentFragment();
    const cellWidth = document.querySelector(".cell").clientWidth;
    ships.forEach((ship) => {
      fragment.append(this.#createShip(ship,cellWidth));
    });

    this.#innerBoard.innerHTML = ""
    this.#innerBoard.append(fragment);
  }


  #createShip(ship,cellWidth){
    const {name,length,img} = ship
      const shipContainer = document.createElement("div");
      
      const shipName = document.createElement("h3");
      shipName.innerText = name;
      const shipImg = img.cloneNode(true);

      const height = cellWidth * length
      shipImg.style.width = `${height}px`;
      shipImg.style.height = `${cellWidth}px`;
      
      
      const shipImgContainer = document.createElement("div")
      shipImgContainer.classList.add("shipImgContainer")
      shipImgContainer.append(shipImg)
      shipImgContainer.dataset.holes = length;
      shipImgContainer.dataset.name = name;


     
      shipImgContainer.addEventListener("pointerdown",this.#selectShip.bind(this))

      const holes = document.createElement("p");
      holes.innerText = `${length} holes`;

      shipContainer.append(shipName, shipImgContainer, holes);
      shipContainer.classList.add("ship",name);
      return shipContainer
  }



  #selectShip(event){
    const target = event.currentTarget
    if (target.classList.contains("place")) return
    target.classList.add("absolute","pointerNone")
    this.#shipsBoard.classList.add("height40")
    this.activeShip = target
    this.#gameScreen.append(this.activeShip)
    this.#moveShip()
  }



  resetShip(ship){
      ship.classList.remove("absolute","place","rotate")
      ship.remove(this.buttonContainer)
      const parent = this.#innerBoard.querySelector(`.${ship.dataset.name}`)
      parent.insertBefore(ship,parent.lastElementChild)
      this.placeShip(ship)
  }

  placeShip(ship){
    ship.classList.remove("pointerNone")
    document.removeEventListener("mousemove",this.mouseCoverFn)
    document.removeEventListener("touchmove",this.touchCoverfn)
    this.activeShip = null
  }



  showEditButtons = (e) => {
   const target = e.currentTarget
   if (target.contains(this.buttonContainer)){
    this.buttonContainer.remove()
    return
   }
   target.append(this.buttonContainer)
   sounds['select'].play().catch((e) => console.log(e))
  }



  

  



  #makeButtons(){
    const rightButton = document.createElement("button")
    rightButton.id = "placeShip"



    const checkImg = document.createElement("img")
    checkImg.src = check

    rightButton.append(checkImg)

    rightButton.addEventListener("click",this.done)


    const rotateButton = document.createElement("button")
    rotateButton.id = "rotateShip"


    
    
    const rotateImg = document.createElement("img")
    rotateImg.src = rotate
    
    
    rotateButton.append(rotateImg)
    rotateButton.addEventListener("click",this.rotateShip)
   
    
    const cancelButton = document.createElement("button")
    cancelButton.id = "cancelShip"


    const cancelImg = document.createElement("img")
    cancelImg.src = cancel

    cancelButton.append(cancelImg)
    cancelButton.addEventListener("click",this.cancelShip)


    const buttonsContainer = document.createElement("div")
    buttonsContainer.classList.add("buttonCon")
    buttonsContainer.append(rightButton,rotateButton,cancelButton)




    return buttonsContainer
  }



  done = (e) => {
    const ship = this.getShipFromEvent(e)
    ship.classList.add("pointerNone")
    this.activeShip = ship
    this.releaseCustomMouseUpEvent({target:null},true)
    this.activeShip = null
  }



  cancelShip = (e) => {
    this.resetShip(this.getShipFromEvent(e))
  }




  



  getShipFromEvent(event){
    const rotateButton = event.currentTarget
    return rotateButton.parentNode.parentNode 
  }


  rotateShip = (event) => {
    event.stopPropagation()
    const ship = this.getShipFromEvent(event)
    this.buttonContainer.remove()
    const added = ship.classList.toggle("rotate")
    added ? ship.dataset.turn = "1" : ship.dataset.turn = "0"
    this.activeShip = ship
    this.releaseCustomMouseUpEvent({target:null})
  }
















  mouseCoverFn = (e) => this.#changeShipCords(e.pageX,e.pageY)
  touchCoverfn = (e) => this.#changeShipCords(e.touches[0].pageX,e.touches[0].pageY)

  #moveShip(){
    document.addEventListener("mousemove",this.mouseCoverFn)
    document.addEventListener("touchmove",this.touchCoverfn)
  }

  #changeShipCords(x,y){
    if (!this.activeShip) return

    this.activeShip.style.left = `${x}px`
    this.activeShip.style.top = `${y}px`
  }
}

const shipsBoard = new shipsUi();

export {shipsBoard}