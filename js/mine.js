
/** DECLARE TEMPORARY DATA **/
tempValues = [
    {
        value: 1,
        current: 1,
        goal: 1
    },
    {
        value: 2,
        current: 2,
        goal: 2
    },
    {
        value: 3,
        current: 3,
        goal: 3
    },
    {
        value: 4,
        current: 4,
        goal: 4
    },
    {
        value: 5,
        current: 5,
        goal: 5
    },
    {
        value: 6,
        current: 6,
        goal: 6
    },
    {
        value: 7,
        current: 7,
        goal: 7
    },
    {
        value: 8,
        current: 9,
        goal: 8
    }
];
size = 3;


class Tile {
    value; // the text on the tile
    id;

    constructor(value, currentPosition, goalPosition) {
        this.currentPosition = currentPosition;
        this.goalPosition = goalPosition;
        this.value = value;
        this.id = Math.random().toString(36).slice(-5); //random 5 characters
    }
}

class Space {
    position;
    goalTile = null;
    currentTile = null;

    upSpace;
    rightSpace;
    downSpace;
    leftSpace;

    constructor(position, goalTile, currentTile) {
        this.position = position;
        if (goalTile !== undefined) this.goalTile = goalTile;
        if (currentTile !== undefined) this.currentTile = currentTile;
    }

    setUpSpace(tile){
        this.upSpace = tile;
    }
    setRightSpace(tile){
        this.rightSpace = tile;
    }
    setDownSpace(tile){
        this.downSpace = tile;
    }
    setLeftSpace(tile){
        this.leftSpace = tile;
    }
}

class BoardState {
    spaces;
    isSolution;

    previousMove; // "up" "down" "left" "right"
    previousState; // BoardState

    manhattanDistance;

    constructor(spaces) {
        this.spaces = spaces;
        this.isSolution = this.checkIfSolved(this.spaces);
        this.manhattanDistance = this.getManhattanDistance();
    }


    checkIfSolved() {
        for (let s in this.spaces) { // For every tile
            let space = this.spaces[s];
            if (space.currentTile !== space.goalTile) {return false;}
        }
        return true;
    }

    /** Calculate Manhattan Distance **/
    getManhattanDistance () {
        let distance = 0;
        for (let i = 0; i < this.spaces.length; i++) {
            let currentSpace = this.spaces[i];
            let currentTile = currentSpace.currentTile;
            let goalSpace = this.spaces.find(space => space.currentTile === currentSpace.goalTile)
            distance += this.countManhattan(currentSpace, goalSpace);
        }
        return distance;
    }
    countManhattan(spaceA, spaceB){
        let distance = 0;
        distance += Math.abs(spaceA.position[0] - spaceB.position[0]);
        distance += Math.abs(spaceA.position[1] - spaceB.position[1]);
        return distance;
    }

    /** Console log a text representation of the board **/
    draw() {
        let output = "";
        let nSpaces = this.spaces.length;
        let size = Math.sqrt(nSpaces);
        for (let i = 0; i < nSpaces; i++){
            let currentTile = this.spaces[i].currentTile;

            let currentValue;
            if (currentTile){currentValue = currentTile.value}  else {currentValue = "_"}
            output += currentValue + "\t"

            if ((i+1) % size === 0){
                output += "\n"
            }
        }
        console.log(output);
    }
}

class Puzzle {
    tiles = [];
    spaces = [];
    startState;

    constructor(size, data) {
        /** Ensure correct number of tile inputs **/
        if(data.length !== size*size - 1){ // Check for the right number of inputs
            throw new Error("Invalid number of inputs for this grid size")
        }

        /** Make tiles **/
        for (let i = 0; i < size*size - 1; i++){ // for every tile in the grid (last, empty tile will get undefined value)
            let x = Math.floor(i/size);
            let y = i % size;
            let input = tempValues[i]
            let tile = new Tile(input.value, input.current, input.goal);
            this.tiles.push(tile);
        }

        /** Make spaces **/
        for (let i = 0; i < size*size; i++) {
            let x = Math.floor(i/size);
            let y = i % size;
            let space = new Space(
                [x,y],
                this.tiles.find(tile => tile.goalPosition === i+1),
                this.tiles.find(tile => tile.currentPosition === i+1)
            );
            this.spaces.push(space);
        }

        /** Link neighbor Spaces **/
        for (let i = 0; i < this.spaces.length; i++){
            let currentSpace = this.spaces[i];
            let currentX = currentSpace.position[0];
            let currentY = currentSpace.position[1];

            let up = this.spaces.find(space => space.position[0] === currentX-1 && space.position[1] === currentY);
            let right = this.spaces.find(space => space.position[0] === currentX && space.position[1] === currentY+1);
            let down = this.spaces.find(space => space.position[0] === currentX+1 && space.position[1] === currentY);
            let left = this.spaces.find(space => space.position[0] === currentX && space.position[1] === currentY-1);

            currentSpace.setUpSpace(up);
            currentSpace.setRightSpace(right);
            currentSpace.setDownSpace(down);
            currentSpace.setLeftSpace(left);
        }
        this.startState = new BoardState(this.spaces);
    }

    getBlankSpace() {

    }

}





let puzzle = new Puzzle(size, tempValues);
puzzle.startState.draw();
puzzle.startState.getManhattanDistance();



/** Convert a space number (in a 3x3, these are 1-9) to a coordinate pair like [0,0] **/
function spaceNumToCoords(n, size){
    if (n < 1) throw new Error("Square number must be greater than zero");
    if (n > size*size) throw new Error("Invalid square number for this grid size");

    let x = Math.floor((n-1)/size);
    let y = (n-1) % size;
    return [x, y];
}

function coordsToSquareNum([x,y], size) {
    if (x > size-1 || y > size-1) throw new Error("Invalid coordinates")
    return(x*size + y + 1)
}

