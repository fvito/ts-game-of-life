/**
 * Cells state
 */
export enum State {
    DEAD = 0,
    ALIVE = 1,
}

export class Cell {
    /**
     * X coordinate of the cell on the board
     */
    public x: number;
    /**
     * Y coordinate of the cell on the board
     */
    public y: number;
    /**
     * Width of the cell when drawing
     */
    public width: number;
    /**
     * Height of the cell when drawing
     */
    public height: number;
    /**
     * Cells current state
     */
    public state: State = State.DEAD;
    /**
     * Cells state for the next pass
     */
    public nextState: State = State.DEAD;
    /**
     * Cells display color
     * @type {string}
     */
    public color = "black";

    /**
     *
     * @param x X position of the cell on the board
     * @param y Y position of the cell on the board
     * @param resolution Game resolution, how wide and tall cell is
     * @param state Cells initial state
     */
    constructor(x: number, y: number, resolution: number, state?: State) {
        this.x = x;
        this.y = y;
        this.width = resolution;
        this.height = resolution;
        if (state) {
            this.state = state;
            this.nextState = state;
        } else {
            this.state = State.DEAD;
            this.nextState = State.DEAD;
        }
    }

    /**
     * Swaps the cells current state with the next state
     */
    public swapState() {
        this.state = this.nextState;
    }

    /**
     * Set the both, current and next state to the same state
     * @param value Desired state
     */
    public setState(value: State) {
        this.state = value;
        this.nextState = value;
    }

    /**
     * Sets the height and width of the cell
     * @param {number} width Desired width
     * @param {number} height Desired height
     */
    public setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export default Cell;
