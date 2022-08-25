import { QueueFrontier, StackFrontier } from "./frontier.js"
import Node from "./mazeNode.js"
import Vector2 from "./vector2.js"

const getCandidates = ({ row, col }) =>
    [
        { direction: "up", position: new Vector2({ row: row - 1, col: col }) },
        { direction: "down", position: new Vector2({ row: row + 1, col: col }) },
        { direction: "right", position: new Vector2({ row: row, col: col + 1 }) },
        { direction: "left", position: new Vector2({ row: row, col: col - 1 }) },
    ]

export default class Maze {

    /**
     * @type Vector2 Coordinates
     */
    #goal

    /** 
     * @type Vector2 Coordinates
     */
    #start

    /**
     * @type Array<Boolean> Walls of the maze
     */
    #walls

    /**
     * @type Array<Cells, Actions> Solution to the maze
     */
    #solution

    /**
     * @type DefaultFrontier Actual nodes to check
     */
    #frontier

    /**
    * @type Array<Vector2> Already checked Nodes
    */
    #explored

    /**
     * @type number Time to print the solution.
     */
    #intervalTime


    #searchType

    constructor(searchType) {
        this.#intervalTime = 100

        this.#walls = localStorage.getItem("walls") ? JSON.parse(localStorage.getItem("walls")) : JSON.parse(JSON.stringify(new Array(10).fill(new Array(10).fill(false))));

        this.#start = new Vector2({ row: 0, col: 0 });
        this.#goal = new Vector2({ row: 9, col: 9 });

        this.print()

        this.#solution = null
        this.setSearchType(searchType)
    }

    setSearchType(type) {
        this.#searchType = type

        if (this.#searchType === "Deep First Search") {
            this.#frontier = new QueueFrontier()
        } else {
            this.#frontier = new StackFrontier()
        }

    }

    print() {

        const maze = document.querySelector("[data-maze]")
        maze.innerHTML = ""

        for (let j in this.#walls) {
            let line = document.createElement("div")
            line.classList.add("row")
            for (let i in this.#walls[j]) {

                const position = new Vector2({ row: +j, col: +i })

                let element = document.createElement("div")
                element.classList.add("box")
                if (this.#walls[j][i]) element.classList.add("wall")
                else if (this.#start.equals(position)) element.classList.add("start")
                else if (this.#goal.equals(position)) element.classList.add("goal")
                else element.classList.add("empty")

                element.id = `${j}-${i}`

                element.dataset.row = j
                element.dataset.col = i

                element.innerText = `${j}-${i}`
                line.appendChild(element)
            }

            maze.appendChild(line)
        }
    }

    getNeighbors(state) {
        const { row, col } = state
        const candidates = getCandidates({ row, col })
        const result = []

        candidates.forEach(({ direction, position }) => {
            const { row, col } = position

            if (this.inBounds(row, col) && !this.#walls[row][col]) {
                result.push({ direction, position: new Vector2({ row, col }) })
            }
        })

        return result
    }

    inBounds(row, col) {
        return row >= 0 && col >= 0 && row < this.#walls.length && col < this.#walls[row].length
    }

    solve() {
        const start = new Node(this.#start, null, null)

        this.#explored = []
        this.#frontier.clear()
        this.#frontier.add(start)

        console.time("Solve");
        while (true) {

            if (this.#frontier.isEmpty()) {
                this.#solution = null
                break
            }

            let node = this.#frontier.remove()

            if (this.#goal.equals(node._state)) {
                this.setSolution(node)
                break
            }

            this.#explored.push(node._state);

            const neighbors = this.getNeighbors(node._state)

            neighbors.forEach(({ direction, position }) => {
                if (!this.#frontier.containsState(position) && !this.#explored.find(state => state.equals(position))) {
                    const child = new Node(position, node, direction)

                    this.#frontier.add(child)
                }

            })


            if (this.#searchType === "Greedy Best First Search") {
                this.#frontier.manhattanSort(this.#goal)
            }

            if (this.#searchType === "A* Search") {
                this.#frontier.greddySort(this.#goal)
            }

        }
        console.timeEnd("Solve");
    }

    setSolution(node) {
        let actions = []
        let cells = []

        while (node._parent) {
            actions.unshift(node._action)
            cells.unshift(node._state)
            node = node._parent
        }

        this.#solution = ({ actions: actions, cells: cells })
    }

    printExplored() {
        let itemIndex = 0


        const exploredInterval = setInterval(() => {

            document.getElementById(this.#explored[itemIndex++].id).classList.add("visited")

            if (this.#explored.length === itemIndex) {
                clearInterval(exploredInterval)
            }

        }, this.#intervalTime)

    }

    printSolution() {
        let itemIndex = 0

        if(!this.#solution){
            return
        }

        setTimeout(() => {

            const solutionInterval = setInterval(() => {
                const element = document.getElementById(this.#solution.cells[itemIndex++].id)
           
                element.classList.add("solution")

                if (this.#solution.cells.length === itemIndex) {
                    clearInterval(solutionInterval)
                }

            }, this.#intervalTime)

        }, this.#intervalTime * this.#explored.length)

    }

    setWall(row, col) {
        const objective = new Vector2({row:+row,col:+col})
        this.clearIntervals()
       
        if(this.#start.equals(objective) || this.#goal.equals(objective)){
            return
        }

        this.#walls[row][col] = !this.#walls[row][col];

        localStorage.setItem("walls", JSON.stringify(this.#walls))

    }

    setBoxListener() {
        document.querySelectorAll(".box").forEach(box => {
            box.addEventListener("click", (e) => {
                const { row, col } = e.target.dataset;
                this.setWall(row, col)
                this.remakeSearch()
            })
        })
    }

    clearIntervals() {
        const highestTimeoutId = setTimeout(";");

        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

    }

    remakeSearch() {
        document.querySelector("[data-maze]").innerHTML = ""
        this.solve();
        this.print();
        this.setBoxListener()
        this.printExplored();
        this.printSolution();
    }

}