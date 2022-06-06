class Node {
    constructor(data, level, fval) {
        this.data = data; //[[]]
        this.level = level;
        this.fval = fval;
    }

    // Try to move the blank square in the given direction; return null if it's out of bounds.
    shuffle(data, size, startX, startY, endX, endY) {
        if (size <= endX < 0 || size <= endY < 0) return null;
    }


    generate_child(){
        //Generate child nodes from the given node by moving the blank space in one of four directions (up, down, left, right)

    }
}

class Puzzle{

    startNode;

    constructor(size, startData, goalData) {
        this.size = size;
        this.open = [];
        this.closed = [];

        this.startNode = new Node(startData, 0, 0);
        this.startNode.fval = this.getFValue(this.startNode, goalData);
    }

    getFValue(){
        return this.getHValue() + this.startNode.level
    }

    getHValue(startNode, goalData){
        let startData = startNode.data;
         
    }


}

let puzzle = new Puzzle(
    3,
    startData = [[1,2,3],[4,5,6],[7,-1,8]],
    goalData  = [[1,2,3],[4,5,6],[7,8,-1]]
)