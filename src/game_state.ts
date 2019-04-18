import Blueprint from "./blueprint";
import Chrono from "./chrono";
export class GameState {
    /**
     * Is game in running state
     */
    public running = false;
    /**
     * Time it took to do one step of algorithm
     * @type {number}
     */
    public stepTime = 0;
    /**
     * Time it took to swap cells states and draws them
     * @type {number}
     */
    public swapTime = 0;
    /**
     * Time it took to draw the board(grid)
     * @type {number}
     */
    public drawTime = 0;
    /**
     * Currently selected blueprint for placement
     */
    public selectedBlueprint!: Blueprint;
    /**
     *  Use the currently selected blueprint
     * @type {boolean}
     */
    public hasSelectedBlueprint = false;
}
export default GameState
