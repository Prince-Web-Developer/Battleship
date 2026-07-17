import ship1 from "/asssets/images/battleship.png";
import ship2 from "/asssets/images/destroyer.png";
import ship3 from "/asssets/images/ship3.png";
import ship4 from "/asssets/images/patrol.png";
import ship5 from "/asssets/images/carrier.png";
import ship6 from "/asssets/images/ship6.png";
import ship7 from "/s.png";



const shipsImg = [ship1, ship2, ship3, ship4, ship5, ship6, ship7];
const shipImages = shipsImg.map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

const ships = [
  { name: "carrier", length: 5, img: shipImages[4] },
  { name: "battleship", length: 4, img: shipImages[0] },
  { name: "submarine", length: 3, img: shipImages[6] },
  { name: "destroyer", length: 3, img: shipImages[1] },
  { name: "patrol", length: 2, img: shipImages[3] },
];

export{shipImages,ships}