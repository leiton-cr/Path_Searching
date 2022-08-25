/**
 * Generic frontier model.
 * It allows to keep the revision order of the nodes.
 */
class DefaultFrontier {

    /**
     * @type Array<Node> Nodes to check
     */
    #frontier

    constructor() {
        this.#frontier = []
    }

    /**
     * Allows to add a node to the current frontier
     * @param {MazeNode} node 
     */
    add(node) {
        this.#frontier.push(node)
    }

    /**
     * Check if the submitted state exists on the frontier
     * @param {Any} state: State to validate
     * @returns {boolean}: Result
     */
    containsState(state) {
        return this.#frontier.some(node => node._state.equals(state))
    }

    /**
     * Check if the frontier is empty
     * @returns {boolean}: Result
     */
    isEmpty() {
        return this.#frontier.length === 0
    }

    /**
     * Removes the frontier nodes
     */
    clear() {
        this.#frontier = []
    }

    /**
     * Actual frontier
     */
    get _frontier() {
        return this.#frontier
    }

    manhattanSort(goal){
        this.#frontier.sort((a, b) => this.manhattanDistance(a._state,goal) - this.manhattanDistance(b._state,goal))
    }

    greddySort(goal){
        this.#frontier.sort((a, b) => this.greddyDistance(a,goal) - this.greddyDistance(b,goal))
    }

    manhattanDistance(position,goal){
        return  Math.abs(position.row - goal.row) + Math.abs(position.col - goal.col)
    }

    greddyDistance(node,goal){
        return this.manhattanDistance(node._state, goal) + node._traveled + 1
    }

}

/**
 * Deep First Search.
 * Specific frontier model, eliminates the nodes in the form of a stack.
 */
class StackFrontier extends DefaultFrontier {
       
    /**
     * Removes the last node
     * @returns {MazeNode} Deleated node
     */
    remove() {
        if (this.isEmpty()) {
            throw "Empty Frontier"
        }

        return this._frontier.shift()
    }
}

/**
 * Breadth First Search.
 * Specific frontier model, eliminates the nodes in the form of a queue.
 */
class QueueFrontier extends DefaultFrontier {
    
    /**
     * Removes the first node
     * @returns {MazeNode} Deleated node
     */
    remove() {
        if (this.isEmpty()) {
            throw "Empty Frontier"
        }

        return this._frontier.pop();
    }
}

export { StackFrontier, QueueFrontier }