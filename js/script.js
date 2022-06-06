// Begin game once DOM loaded
document.addEventListener("DOMContentLoaded", load);

function getSyncScriptParams() {
  var scripts = document.getElementsByTagName('script');
  var lastScript = scripts[scripts.length-1];
  var scriptName = lastScript;
  return {
    string: scriptName.getAttribute('data-string'),
    shuffle: scriptName.getAttribute('data-shuffle')
  };
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
  fig.appendChild(list)

  const caption = document.createElement('figcaption');
  caption.textContent = "Word Slider | ";

  const shuffle_button = document.createElement('a');
  shuffle_button.setAttribute('id', 'shuffle');
  shuffle_button.textContent = "Shuffle ";
  caption.appendChild(shuffle_button);

  const solve_button = document.createElement('a');
  solve_button.setAttribute('id', 'solve');
  solve_button.textContent = "Solve ";
  caption.appendChild(solve_button);

  const hints_button = document.createElement('input')
  hints_button.setAttribute('type', 'checkbox');
  hints_button.setAttribute('id', 'hints');
  const hints_label = document.createElement('label')
  hints_label.setAttribute('for', 'label')
  hints_label.textContent= " | Hints?";
  caption.appendChild(hints_label);
  caption.appendChild(hints_button);

  fig.appendChild(caption);


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

  const game_wrapper = document.getElementById("slider-game");
  game_wrapper.appendChild(fig);

  let modal = document.createElement('div');
  modal.setAttribute('id', 'winner');
  modal.classList.add('modal');
  let modal_content = document.createElement('div');
  modal_content.classList.add('modal-content');
  modal_content.textContent = 'Congratulations!'
  modal.appendChild(modal_content)
  let close = document.createElement('span');
  close.textContent = 'x';
  close.classList.add('close');
  modal_content.appendChild(close)
  game_wrapper.appendChild(modal)

}


function load(){

  let tiles = parse_words(getSyncScriptParams()["string"])

  make_dom(tiles)

  let shuffled = parse_shuffle(getSyncScriptParams()["shuffle"])


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

  // Array of tileNumbers in order of last moved
  let history = [];

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
  function moveTile(tile, recordHistory = true) {
    // Check if Tile can be moved
    // (must be touching empty tile)
    // (must be directly perpendicular to empty tile)
    const tileID = tile.dataset.id;
    if (!tileMovable(tileID)) {
      console.log("Tile " + tileID + " can't be moved.");
      return;
    }

    // Push to history
    if (recordHistory === true) {

      if (history.length >= 3) {
        if (history[history.length-1] !== history[history.length-3]) history.push(tileID);
      } else {
        history.push(tileID);
      }
    } 

    // Swap tile with empty tile
    const emptyPosition = tileMap.empty.position;
    tileMap.empty.position = tileMap[tileID].position;

    const xMovement = parentX * (getLeft(emptyPosition) / 100);
    const yMovement = parentX * (getTop(emptyPosition) / 100);
    tile.style.webkitTransform = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)";

    tileMap[tileID].position = emptyPosition;

    recolorTile(tile, tileID);
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

    // Clear history if solved
    history = [];
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
    console.log(tileMap);
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
    setTimeout(() => {  modal.style.display = "block"; }, 500);
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

  /** Readjust tiles on window resize! **/
  window.addEventListener('resize', function(event) {
    parentX = document.querySelector(".sliding-puzzle").clientHeight; //FIXME: Handle with CSS
    setup();
  }, true);


  /** Winner modal **/
  var modal = document.getElementById("winner");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}






