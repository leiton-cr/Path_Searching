export default class Vector2{
    #row
    #col
    
    constructor({row,col}) {
        this.#row = row
        this.#col = col
    }

    get row() {
        return this.#row
    }

    get col() {
        return this.#col
    }

    get id(){
        return `${this.#row}-${this.#col}`
    }

    /**
     * Validates if the given vector is equal to the current vector.
     * @param {Vector2} vector 
     * @returns Resultado
     */
    equals(vector){
        return this.#row === vector.row && this.#col === vector.col
    }

}