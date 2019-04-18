import {Cell, State} from "./cell";

export class Blueprint {
    /**
     * Blueprint width
     */
    public x: number;
    /**
     * Blueprint height
     */
    public y: number;
    /**
     * Blueprint cell states
     */
    public cells!: State[][];
    /**
     * Name of the blueprint
     */
    public name: string;

    /**
     * Creates a new blueprint
     * @param {number} x Width of the blueprint
     * @param {number} y Height of the blueprint
     * @param {State[][]} cells Cell states of the blueprint
     * @param {string} name Optional, blueprint name, defaults to Unknown
     */
    constructor(x: number, y: number, cells: State[][], name = "Unknown") {
        this.x = x;
        this.y = y;
        this.name = name;
        this.cells = cells;
    }
}
export default Blueprint;
