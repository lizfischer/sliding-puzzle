// Begin game once DOM loaded
document.addEventListener("DOMContentLoaded", game);


function game() {

  // Data structure to hold positions of tiles
  let parentX = document.querySelector(".sliding-puzzle").clientHeight; //FIXME: Handle with CSS
  const baseDistance = 34.5;
  let answer = {
    1: {
      tileNumber: 1,
      position: 1,
      top: 0,
      left: 0
    },
    2: {
      tileNumber: 2,
      position: 2,
      top: 0,
      left: baseDistance * 1
    },
    3: {
      tileNumber: 3,
      position: 3,
      top: 0,
      left: baseDistance * 2
    },
    4: {
      tileNumber: 4,
      position: 4,
      top: baseDistance,
      left: 0
    },
    5: {
      tileNumber: 5,
      position: 5,
      top: baseDistance,
      left: baseDistance
    },
    6: {
      tileNumber: 6,
      position: 6,
      top: baseDistance,
      left: baseDistance * 2
    },
    7: {
      tileNumber: 7,
      position: 7,
      top: baseDistance * 2,
      left: 0
    },
    8: {
      tileNumber: 8,
      position: 8,
      top: baseDistance * 2,
      left: baseDistance
    },
    empty: {
      position: 9,
      top: baseDistance * 2,
      left: baseDistance * 2
    }
  }
  let tileMap = JSON.parse(JSON.stringify(answer));

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
    // tile.style.left = tileMap[tileId].left + '%';
    // tile.style.top = tileMap[tileId].top + '%';
    const xMovement = parentX * (tileMap[tileId].left / 100);
    const yMovement = parentX * (tileMap[tileId].top / 100);
    tile.style.webkitTransform = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)";
    //recolorTile(tile, tileId);
  }

  function tileClicked(event) {
    const tileNumber = event.target.dataset.id;
    moveTile(event.target);

    if (checkSolution()) {
      console.log("You win!");
    }
  }

  // Moves tile to empty spot
  // Returns error message if tile cannot be moved
  function moveTile(tile, recordHistory = true) {
    console.log(tile)
    // Check if Tile can be moved 
    // (must be touching empty tile)
    // (must be directly perpendicular to empty tile)
    const tileID = tile.dataset.id;
    console.log(tileID)
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
    const emptyTop = tileMap.empty.top;
    const emptyLeft = tileMap.empty.left;
    const emptyPosition = tileMap.empty.position;
    tileMap.empty.top = tileMap[tileID].top;
    tileMap.empty.left = tileMap[tileID].left;
    tileMap.empty.position = tileMap[tileID].position;

    // tile.style.top = emptyTop  + '%'; 
    // tile.style.left = emptyLeft  + '%';

    const xMovement = parentX * (emptyLeft / 100);
    const yMovement = parentX * (emptyTop / 100);
    tile.style.webkitTransform = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)";

    tileMap[tileID].top = emptyTop;
    tileMap[tileID].left = emptyLeft;
    tileMap[tileID].position = emptyPosition;

    //recolorTile(tile, tileNumber);
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

  // Check if tile is in correct place!
  function recolorTile(tile, tileId) {
    if (tileId === tileMap[tileId].position) {
      tile.classList.remove("error");
    } else {
      tile.classList.add("error");
    }
  }


  // Shuffles the current tiles
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

  // Temporary function for solving puzzle.
  let solveTimeouts = []
  function solve() {  // FIXME: Change this to just show a solution
    tileMap = answer;
    setup();

    /*clearTimers(shuffleTimeouts);


    let repeater = history.length;

    for (let i = 0; i < repeater; i++) {
      console.log(history)
      console.log("started");
      let lastMoved = history.pop();
      let locatedTileNumber = tileMap[lastMoved].tileNumber;
      let domTile = tiles[locatedTileNumber-1];
      solveTimeouts.push(setTimeout(moveTile, i*200, domTile, false));
    }*/
  }


}
