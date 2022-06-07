// Begin game once DOM loaded
document.addEventListener("DOMContentLoaded", load);

function get_board_state(tileMap){
  str = ``
  for (i=1; i < 9; i++){
    str += tileMap[i].position
  }
  str += tileMap["empty"].position
  return str
}

function getTop(position, baseDistance = 34.5){
  if (position <= 3) return 0;
  if (position <= 6) return baseDistance;
  return baseDistance * 2;
}
function getLeft(position, baseDistance = 34.5){
  return baseDistance * ((position-1) % 3);
}

function parse_words(string){
  w1 = string.slice(0,6)
  w2 = string.slice(6,12)
  w3 = string.slice(12,18)
  w4 = string.slice(18,24)
  w5 = string.slice(24,28)
  w6 = string.slice(28,32)

  t1 = w1.slice(0,2) + w2.slice(0,2)
  t2 = w1.slice(2,4) + w2.slice(2,4)
  t3 = w1.slice(4,6) + w2.slice(4,6)
  t4 = w3.slice(0,2) + w4.slice(0,2)
  t5 = w3.slice(2,4) + w4.slice(2,4)
  t6 = w3.slice(4,6) + w4.slice(4,6)
  t7 = w5.slice(0,2) + w6.slice(0,2)
  t8 = w5.slice(2,4) + w6.slice(2,4)

  tiles = [t1,t2,t3,t4,t5,t6,t7,t8]
  return tiles
}
function parse_shuffle(string){
  tileMap = {}
  for (let i = 1; i < 9; i++){
    tileMap[i] = {
      "tileNumber": i,
      "position": parseInt(string[i-1])
    }
  }
  tileMap["empty"] = {
    "position": parseInt(string[8])
  }
  return tileMap
}

function make_dom(tiles){
  const fig = document.createElement('figure');
  fig.classList.add('sliding-puzzle-figure');

  const list = document.createElement('ul');
  list.classList.add('sliding-puzzle');
  list.setAttribute('id', 'tile-wrapper');

  const controls = document.createElement('div');
  controls.setAttribute('id', 'game-controls')

  const help_button = document.createElement('a');
  help_button.setAttribute('id', 'help-toggle');
  help_button.textContent = "How to play ";

  const shuffle_button = document.createElement('a');
  shuffle_button.setAttribute('id', 'shuffle');
  shuffle_button.textContent = "Shuffle ";
  controls.appendChild(shuffle_button);

  const solve_button = document.createElement('a');
  solve_button.setAttribute('id', 'solve');
  solve_button.textContent = "Solve ";

  const hints_button = document.createElement('input')
  hints_button.setAttribute('type', 'checkbox');
  hints_button.setAttribute('id', 'hints');
  const hints_label = document.createElement('label')
  hints_label.setAttribute('id', 'hints-label')
  hints_label.textContent= "Confirm tile positions?";

  const clues_button = document.createElement('input')
  clues_button.setAttribute('type', 'checkbox');
  clues_button.setAttribute('id', 'clues-toggle');
  const clues_label = document.createElement('label')
  clues_label.setAttribute('id', 'clues-label')
  clues_label.textContent= "Show clues?";


  const line1= document.createElement('span');
  const line2= document.createElement('span');
  line1.appendChild(help_button);
  line1.appendChild(solve_button);
  hints_label.appendChild(hints_button);
  line2.appendChild(hints_label);
  clues_label.appendChild(clues_button);
  line2.appendChild(clues_label);

  controls.appendChild(line1)
  controls.appendChild(line2)
  fig.appendChild(list);


  const tile_wrapper = document.getElementById("tile-wrapper")
  for (let i = 0; i < tiles.length; i++){
    const tile_elem = document.createElement(`li`);
    tile_elem.setAttribute("data-id", i+1);
    tile_elem.classList.add('tile')

    for (let j = 0; j < tiles[i].length; j++){
      const letter = document.createElement("span");
      letter.innerHTML = tiles[i][j]
      tile_elem.appendChild(letter);
    }
    list.append(tile_elem);
  }

  /** WIN MODAL **/
  let modal = document.createElement('div');
  modal.setAttribute('id', 'winner');
  modal.classList.add('modal');
  let modal_content = document.createElement('div');
  modal_content.classList.add('modal-win');
  modal_content.textContent = 'Winner!'
  modal.appendChild(modal_content)
  let close = document.createElement('span');
  close.textContent = 'x';
  close.setAttribute('id', 'close-win');
  close.classList.add('close');
  modal_content.appendChild(close)

  let trophy = document.createElement('img')
  trophy.setAttribute('src', 'https://www.lizmfischer.com/static/files/success_cup.jpg')
  modal_content.appendChild(trophy)


  /** HELP MODAL **/
  let help_modal = document.createElement('div');
  help_modal.setAttribute('id', 'help');
  help_modal.classList.add('modal');
  let help_modal_content = document.createElement('div');
  help_modal_content.classList.add('modal-help');

  help_modal.appendChild(help_modal_content)

  const game_wrapper = document.getElementById("slider-game");
  const clues = document.getElementById("clues");
  game_wrapper.insertBefore(controls, clues);
  game_wrapper.insertBefore(fig, clues);
  game_wrapper.insertBefore(modal, clues);
  game_wrapper.insertBefore(help_modal, clues);
  help_modal_content.innerHTML = '<span id="close-help" class="close">x</span><h2>How to play</h2>' +
      '<p>Slide tiles to form a grid consisting entirely of valid words.</p>' +
      '<p>You can adjust the difficulty by turning on "Confirm tile positions," which highlights correct tiles in green, or "Show clues," which provides a crossword-style hint to each entry.</p>'

}
function load_styles(){
  let styles = `#slider-game #shuffle {
    display: none;
}

#slider-game #clues {
    display: none;
    justify-content: center;
    font-weight: normal;
} #slider-game #clues ol {
      width:50%
  }
  
#slider-game #help-toggle, #slider-game #solve{
  cursor: pointer;
    padding-right: 10px;
}
#slider-game #hints-label, #slider-game #clues-label{
    padding-right: 10px;
}


#slider-game {
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 700;
    font-size: 24px;
    margin:auto;
    max-width:100vw;
    /*max-width: 80vw !important;
     max-height: 80vw !important;*/
    -webkit-tap-highlight-color: transparent;
    khtml-tap-highlight-color: transparent;
}

#slider-game .modal {
    display: none; /*  Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
#slider-game .modal-win {
    background-color: #81B5CC;
    margin: 10% auto; /* 15% from the top and centered */
    padding: 3%;
    border: 1px solid #888;
    width: 40vw;
    max-width: 400px;
    min-height: 20vh;
    text-align: center;
    color: white;
    font-size: 3vw;
}

#slider-game .modal-win img {
    width: 70%;
    display: block;
    margin: auto;
}

#slider-game .modal-help {
    background-color: #ffffff;
    margin: 5% auto; /* 15% from the top and centered */
    padding: 3%;
    border: 1px solid #888;
    width: 40vw;
    max-width: 400px;
    min-height: 20vh;
    text-align: center;
    color: black;
    font-size: 1em;
}
#slider-game .modal-help p{
    font-weight: normal;
}
#slider-game .modal-help #close-help {
    color: black;
}


/* The Close Button */
#slider-game .close {
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

#slider-game .close:hover,
#slider-game .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

#slider-game #game-controls {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
#slider-game #game-controls #hints-label{
    display: inline-block;
    color: #E74C3C;
}#slider-game #game-controls #clues-label{
     display: inline-block;
     color: #66a722;
 }
#slider-game #game-controls label::before{
    /* content:" | ";*/
    color:black;
}
#slider-game input{
    width: 1.2em;
    height: 1.2em;
}

#slider-game #slider-game{
    margin: auto;
    display: flex;
}

#slider-game .sliding-puzzle-figure {
    margin: auto;
    height: 100%;
    width: 100%;
    max-height: 70vh;
    max-width: 70vh;
}
#slider-game .sliding-puzzle-figure a {
    cursor: pointer; }
#slider-game   .sliding-puzzle-figure a#shuffle {
    color: #E74C3C; }
#slider-game  #solve {
    color: #3498DB;
    text-align: center;
}
#slider-game .sliding-puzzle-figure .sliding-puzzle {
    list-style-type: none;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-clip: border-box;
    /* Firefox 4, Safari 5, Opera 10, IE 9 */
    border: 18px solid #2f2f2f;
    border-radius: 10px;
    background-color: #2f2f2f; }
#slider-game   .sliding-puzzle-figure .sliding-puzzle .tile {
    position: absolute;
    background-color: #ffffff;
    color: #1F1F1F;
    border-radius: 10px;
    cursor: pointer;
    width: 31%;
    height: 31%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-size: 5vh;
    left: 0%;
    top: 0%;
    transition: all 0.5s linear;
    transition-timing-function: ease;
    box-sizing: border-box; }
#slider-game    .sliding-puzzle-figure .sliding-puzzle .tile.correct {
    background-color: #bfdb9b; }
#slider-game    .sliding-puzzle-figure .sliding-puzzle .tile span {
    pointer-events: none;
    flex: 50%;
    height: 50%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #2f2f2f;
}

@media only screen and (max-width: 650px) {
    #slider-game  .sliding-puzzle-figure {
        width: 90vw;
        height: 90vw;
        max-height: 100vh; }
    #slider-game   .sliding-puzzle-figure .sliding-puzzle {
        border-width: 10px;
        border-radius: 14px; }
    #slider-game  .sliding-puzzle-figure .tile {
        font-size: 1em; } }
`
  var styleSheet = document.createElement('style')
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

function load(){
  let string = document.getElementById('slider-game').getAttribute('data-string');
  let tiles = parse_words(string)

  load_styles();
  make_dom(tiles);

  let shuffle_string = document.getElementById('slider-game').getAttribute('data-shuffle');
  let shuffled = parse_shuffle(shuffle_string)


  game(shuffled);
}

function game(shuffled) {

  // Data structure to hold positions of tiles
  let parentX = document.querySelector(".sliding-puzzle").clientHeight; //FIXME: Handle with CSS
  let answer = {
    1: {
      tileNumber: 1,
      position: 1
    },
    2: {
      tileNumber: 2,
      position: 2
    },
    3: {
      tileNumber: 3,
      position: 3
    },
    4: {
      tileNumber: 4,
      position: 4
    },
    5: {
      tileNumber: 5,
      position: 5
    },
    6: {
      tileNumber: 6,
      position: 6
    },
    7: {
      tileNumber: 7,
      position: 7
    },
    8: {
      tileNumber: 8,
      position: 8
    },
    empty: {
      position: 9
    }
  }
  let tileMap = shuffled

  // Movement map
  function movementMap(position) {
    if (position === 9) return [6, 8];
    if (position === 8) return [5, 7, 9];
    if (position === 7) return [4, 8];
    if (position === 6) return [3, 5, 9];
    if (position === 5) return [2, 4, 6, 8];
    if (position === 4) return [1, 5, 7];
    if (position === 3) return [2, 6];
    if (position === 2) return [1, 3, 5];
    if (position === 1) return [2, 4];
  }

  document.querySelector('#shuffle').addEventListener('click', shuffle , true);
  document.querySelector('#solve').addEventListener('click', solve , true);
  const tiles = document.querySelectorAll('.tile');

  function setup(){
    // Board setup according to the tileMap
    let delay = -50;
    for(let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener('click', tileClicked ,true );

      const tileId = tiles[i].dataset.id;
      delay += 50;
      setup_tile(tiles[i])
    }
  }
  setup();

  function setup_tile(tile) {
    const tileId = tile.dataset.id;
    const xMovement = parentX * (getLeft(tileMap[tileId].position) / 100);
    const yMovement = parentX * (getTop(tileMap[tileId].position) / 100);
    tile.style.webkitTransform = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)";
    recolorTile(tile, tileId);
  }

  function tileClicked(event) {
    const tileNumber = event.target.dataset.id;
    moveTile(event.target);

    if (checkSolution()) {
      win();
    }
  }

  // Moves tile to empty spot
  // Returns error message if tile cannot be moved
  function moveTile(tile) {
    // Check if Tile can be moved
    // (must be touching empty tile)
    // (must be directly perpendicular to empty tile)
    const tileID = tile.dataset.id;
    if (!tileMovable(tileID)) {
      console.log("Tile " + tileID + " can't be moved.");
      return;
    }

    // Swap tile with empty tile
    const emptyPosition = tileMap.empty.position;
    tileMap.empty.position = tileMap[tileID].position;

    const xMovement = parentX * (getLeft(emptyPosition) / 100);
    const yMovement = parentX * (getTop(emptyPosition) / 100);
    tile.style.webkitTransform = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)";

    tileMap[tileID].position = emptyPosition;

    recolorTile(tile, tileID);
    console.log(get_board_state(tileMap));

  }


  // Determines whether a given tile can be moved
  function tileMovable(tileNumber) {
    const selectedTile = tileMap[tileNumber];
    const emptyTile = tileMap.empty;
    const movableTiles = movementMap(emptyTile.position);

    return movableTiles.includes(selectedTile.position);
  }


  // Returns true/false based on if the puzzle has been solved
  function checkSolution() {
    if (tileMap.empty.position !== 9) return false;

    for (const key in tileMap) {
      if ((tileMap[key].tileNumber !== 1) && (key !== "empty")) {
        if (tileMap[key].position < tileMap[key-1].position) {
          return false;
        }
      }
    }

    return true;
  }



  /** Shuffle the current tiles **/
  let shuffleTimeouts = [];
  function shuffle() {
    clearTimers(solveTimeouts);
    const boardTiles = document.querySelectorAll('.tile');
    let shuffleDelay = 200;
    shuffleLoop();

    let shuffleCounter = 0;
    while (shuffleCounter < 20) {
      shuffleDelay += 200;
      shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
      shuffleCounter++;
    }
  }

  let lastShuffled;

  function shuffleLoop() {
    const emptyPosition = tileMap.empty.position;
    const shuffleableTiles = movementMap(emptyPosition);
    const tilePosition = shuffleableTiles[Math.floor(Math.floor(Math.random() * shuffleableTiles.length))];
    // let locatedTile;
    // let locatedTileNumber;
    let tileIDToShuffle = Object.keys(tileMap).find(tile => tileMap[tile].position === tilePosition);
    let locatedTileNumber = tileMap[tileIDToShuffle].tileNumber;
    let domTile = tiles[locatedTileNumber-1];

    if (lastShuffled !== locatedTileNumber) {
      moveTile(domTile);
      lastShuffled = locatedTileNumber;
    } else {
      shuffleLoop();
    }

  }

  function clearTimers(timeoutArray) {
    for (let i = 0; i < timeoutArray.length; i++) {
      clearTimeout(timeoutArray[i])
    }
  }


  /** WIN **/
  function win(){
    console.log("You win!");
    setTimeout(() => {  win_modal.style.display = "block"; 200});
  }

  /** SOLVE **/
  let solveTimeouts = []
  function solve() {
    tileMap = JSON.parse(JSON.stringify(answer));
    setup();
  }

  /** HINTS **/
  const hints = document.getElementById('hints');
  hints.addEventListener('change', (event) => {
    for (let i = 0; i < tiles.length; i++){
      recolorTile(tiles[i], tiles[i].dataset.id);
    }
  })

  function recolorTile(tile, tileId) {
    if (document.getElementById('hints').checked && parseInt(tileId) === tileMap[tileId].position) {
      tile.classList.add("correct");
    } else {
      tile.classList.remove("correct");
    }
  }

  /** CLUES **/
  const clues_toggle = document.getElementById('clues-toggle');
  clues_toggle.addEventListener('change', (event)=>{
    const clues = document.getElementById('clues');
    if (clues_toggle.checked) {
      clues.style.display = "flex"
    } else {
      clues.style.display = "none"
    }
  })


  /** Readjust tiles on window resize! **/
  window.addEventListener('resize', function(event) {
    parentX = document.querySelector(".sliding-puzzle").clientHeight; //FIXME: Handle with CSS
    setup();
  }, true);


  /** Winner modal **/
  var win_modal = document.getElementById("winner");
  var span = document.getElementById("close-win");
  span.onclick = function() {
    win_modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == win_modal) {
      win_modal.style.display = "none";
    }
  }

  /** Help modal **/
  var help_modal = document.getElementById("help");
  var btn = document.getElementById("help-toggle");
  var span = document.getElementById("close-help");
  btn.onclick = function() {
    help_modal.style.display = "block";
  }
  span.onclick = function() {
    help_modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == help_modal) {
      help_modal.style.display = "none";
    }
  }
}






