class MazeNode{
    #state
    #parent
    #action
    #traveled

    constructor(state, parent, action){
        this.#state = state
        this.#parent = parent
        this.#action = action
        this.#traveled = parent ? parent._traveled + 1 : 0 
    }

    get _state() {
        return this.#state
    }

    get _parent() {
        return this.#parent
    }

    get _action() {
        return this.#action
    }

    get _traveled() {
        return this.#traveled
    }

}

export default MazeNode