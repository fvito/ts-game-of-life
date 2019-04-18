import {anything} from "ts-mockito";
import Blueprint from "./blueprint";
import {Cell, State} from "./cell";
import Chrono from "./chrono";
import GameState from "./game_state";
import Settings from "./settings";
export class Game {

    /**
     * Holds game settings and state
     */
    public settings: Settings;

    public state: GameState = new GameState();

    public chrono: Chrono = new Chrono();
    /**
     * Number of rows on the board
     */
    public rows: number;
    /**
     * Number of column on the board
     */
    public cols: number;
    /**
     * Number of cells which changed their state to ALIVE during algorithm pass
     */
    public alive = 0;

    /**
     * Current game generation
     * @type {number}
     */
    public generation = 0;

    /**
     * Game board of cells
     */
    public cells!: Cell[][];

    private readonly colors: string[] = ["crimson", "darkorange", "gold", "mediumpurple", "indigo", "limegreen", "teal", "black"];

    /**
     *
     * @param settings Game settings
     */
    constructor(settings: Settings) {
        this.settings = settings;
        this.alive = 0;
        /** Game board size depends on the resolution */
        this.rows = this.settings.height / this.settings.resolution;
        this.cols = this.settings.width / this.settings.resolution;
    }

    /**
     * Adds event listeners to the canvas
     */
    public initCanvasEvents(): void {
        /** Listener for the left and right mouse click, invokes the place callback */
        this.settings.canvas.addEventListener("mousedown", this.place, false);
        /** Listener for the mouse hover, invokes the hover callback */
        this.settings.canvas.addEventListener("mousemove", this.hover, false);
    }

    /**
     * Initializes and draws the game with random cell placements
     */
    public initBoard(): void {
        this.initCells();
        this.initCanvasEvents();
        this.drawGrid();
    }

    /**
     * Populates the board with randomly assigned ALIVE cells
     */
    public randomBoard(): void {
        this.randomSeed();
        this.render();
        this.generation = 0;
    }

    /**
     * Clears the game board, all cells have state DEAD
     */
    public clearBoard(): void {
        this.initCells();
        this.render();
        this.generation = 0;
    }

    /**
     * Does one step of the Game of Life algorithm and assigns the next state to the cells.
     * Also keeps count of number of cells that changed their state to ALIVE
     */
    public step = (): void => {
        /** Reset the alive counter */
        this.alive = 0;
        this.generation++;

        this.chrono.startTiming();

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                /** Sum the 3*3 neighbours around the currently selected cell */
                const sum = this.sumNeighbours(cell);
                cell.color = this.colors[sum];
                if (sum === 4) {
                    cell.nextState = cell.state;
                } else if (sum === 3) {
                    this.alive++;
                    cell.nextState = State.ALIVE;
                } else {
                    cell.nextState = State.DEAD;
                }
            }
        }

        this.state.stepTime = this.chrono.stopTiming();

        /** Draw the board */
        this.render();

        if (this.alive === 0) {
            /** Stop the algorithm, there were no changes to the cells states */
            this.state.running = false;
            return;
        }
        /** Wait to finish drawing and repeat the step if game state is in RUN mode */
        if (this.state.running) {
            setTimeout(() => {
                requestAnimationFrame(this.step);
            }, 1000 / this.settings.fps);
        }
    };

    /**
     * Returns the game run state
     * @returns {boolean} True if game is in run state, false otherwise
     */
    public isRunning(): boolean {
        return this.state.running;
    }

    /**
     * Changes the game state and starts the algorithm
     */
    public run(): void {
        this.state.running = !this.state.running;
        this.step();
    }

    /**
     * Resizes the board with the new resolution, cells outside are deleted
     * @param {number} resolution Desired new resolution
     */
    public resize(resolution: number): void {
        const newRows = this.settings.height / resolution;
        const newCols = this.settings.width / resolution;

        if (this.rows > newRows && this.cols > newCols) {
            this.shrink(resolution, newRows, newCols);
        } else {
            this.expand(resolution, newRows, newCols);
        }
        this.cols = newCols;
        this.rows = newRows;
        if (!this.state.running) {
            this.render();
        }
    }

    /**
     * Adds the provided blueprint(changes the cells state) to the board and redraws the board
     * @param {number} x X position where to place the blueprint
     * @param {number} y Y position where to place the blueprint
     * @param {Blueprint} blueprint Blueprint to add
     */
    public addBlueprint(x: number, y: number, blueprint: Blueprint): void {
        for (let i = 0; i < blueprint.y; i++) {
            for (let j = 0; j < blueprint.x; j++) {
                this.cells[i + y][j + x].setState(blueprint.cells[i][j]);
            }
        }
        this.render();
    }

    /**
     * Previews the blueprint, does not change the underlying cells state
     * @param {number} x
     * @param {number} y
     * @param {Blueprint} blueprint
     */
    public previewBlueprint(x: number, y: number, blueprint: Blueprint): void {
        for (let i = 0; i < blueprint.y; i++) {
            for (let j = 0; j < blueprint.x; j++) {
                if (blueprint.cells[i][j] === State.ALIVE) {
                    this.cellPreview(j + x, i  + y);
                }
            }
        }
    }

    /**
     * Marks the provided blueprint as selected for the preview and placement
     * @param {Blueprint} blueprint Blueprint to select
     */
    public selectBlueprint(blueprint: Blueprint) {
        this.state.selectedBlueprint = blueprint;
        this.state.hasSelectedBlueprint = true;
    }

    /**
     * Removes the selected blueprint
     */
    public clearSelectedBlueprint() {
        this.state.hasSelectedBlueprint = false;
    }

    /**
     * Randomly assigns ALIVE state to some cells
     */
    private randomSeed(): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                if (Math.random() > 0.66) {
                    cell.setState(State.ALIVE);
                }
            }
        }
    }

    /**
     * Initializes the board and cells in the board
     */
    private initCells(): void {
        this.cells = [];
        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j] = new Cell(i, j, this.settings.resolution);
            }
        }
    }

    /**
     * Draw the grid on the canvas. Grid size depends on the resolution setting
     */
    private drawGrid(): void {
        this.settings.context.strokeStyle = "rgb(127,127,127)";
        /** Draw the rows, spaced by the resolution setting */
        for (let i = 0; i < this.rows; i++) {
            this.settings.context.beginPath();
            this.settings.context.moveTo(0, i * this.settings.resolution);
            this.settings.context.lineTo(this.settings.canvas.width, i * this.settings.resolution);
            this.settings.context.stroke();
        }
        /** Draw the columns, spaced by the resolution setting */
        for (let i = 0; i < this.cols; i++) {
            this.settings.context.beginPath();
            this.settings.context.moveTo(i * this.settings.resolution, this.settings.canvas.height);
            this.settings.context.lineTo(i * this.settings.resolution, 0);
            this.settings.context.stroke();
        }
    }

    /** Draws a single cell only if its state is ALIVE */
    private drawCell(cell: Cell): void {
        this.settings.context.fillStyle = cell.color;
        if (cell.state === State.ALIVE) {
            this.settings.context.fillRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        }
    }

    /** Re draws the selected cell depending on its state
     *  - Black if the cell is ALIVE
     *  - White if the cell is DEAD
     */
    private updateCellDisplay(cell: Cell): void {
        if (cell.state === State.ALIVE) {
            this.settings.context.fillRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        } else {
            this.settings.context.clearRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        }
    }

    /**
     * Draw only the alive cells on the canvas
     */
    private render(): void {

        /** 1.) clear the display */
        this.clearDisplay();

        /** 2.) draw the grid, based on current settings */
        this.chrono.startTiming();
        if (this.settings.showGrid) {
            this.drawGrid();
        }
        this.state.drawTime = this.chrono.stopTiming();

        this.chrono.startTiming();
        /** 3.) Swap the state of each cell and draw it */
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.cells[i][j];
                /** Swap the cells state and draw it on the board */
                cell.swapState();
                this.drawCell(cell);
            }
        }

        this.state.swapTime = this.chrono.stopTiming();

        /** 4.) Optionali, render the info box */
        if (this.settings.showInfo) {
            this.renderInfoBox();
        }

    }

    /**
     * Draws a small info box in the right hand corner with statistical info which include:
     *  - Current generation
     *  - Number of cells that changed their state to ALIVE
     *  - Time it took to update all cells state
     *  - Time it took to swap states and draw cells
     *  - Time it took to draw the board
     *  - Total time for mentioned operation
     *  - Current FPS setting
     *  - Current resolution setting
     */
    private renderInfoBox() {
        const left = this.settings.width - 150;
        this.settings.context.fillStyle = "rgba(0,0,0,0.6)";
        this.settings.context.fillRect(left, 0, 180, 150);
        this.settings.context.fillStyle = "white";
        this.settings.context.fillText(`Generation: ${this.generation}`, left + 15, 20, 150 - 25);
        this.settings.context.fillText(`Alive: ${this.alive}`, left + 15, 35, 150 - 25);
        this.settings.context.fillText(`Step time: ${this.state.stepTime} ms`, left + 15, 50, 150 - 25);
        this.settings.context.fillText(`Swap state and draw time: ${this.state.swapTime} ms`, left + 15, 65, 150 - 25);
        this.settings.context.fillText(`Grid draw time: ${this.state.drawTime} ms`, left + 15, 80, 150 - 25);
        this.settings.context.fillText(`Total time: ${this.state.stepTime + this.state.swapTime + this.state.drawTime} ms`, left + 15, 95, 150 - 25);
        this.settings.context.fillText(`FPS: ${this.settings.fps}`, left + 15, 110, 150 - 25);
        this.settings.context.fillText(`Resolution: ${this.settings.resolution}`, left + 15, 125, 150 - 25);
    }

    /**
     * Canvas mouse click callback.
     * Decodes the click coordinate and changes the selected cells state or places the selected blueprint
     * - Left Button(0): Marks the selected cell as ALIVE or places the selected blueprint
     * - Right Button(2): Marks the selected cell as DEAD
     * Updates the selected cells display on the board
     *
     */
    private readonly place = (event: MouseEvent): void => {
        let x = event.x;
        let y = event.y;

        x -= this.settings.canvas.offsetLeft;
        y -= this.settings.canvas.offsetTop;

        x = Math.floor(x / this.settings.resolution);
        y = Math.floor(y / this.settings.resolution);

        // console.log(`place: x: ${x} y: ${y} event: ${event}`); */
        if (event.button === 0) {
            if (this.state.hasSelectedBlueprint) {
                this.addBlueprint(x, y, this.state.selectedBlueprint);
            } else {
                this.cells[y][x].setState(State.ALIVE);
            }
        } else if (event.button === 2) {
            this.cells[y][x].setState(State.DEAD);
        }
        this.updateCellDisplay(this.cells[y][x]);
    };

    /**
     * Canvas mouse over event callback
     * Redraws the board and displays the currently selected cell under the mouse cursor as red color, does not change the cell state.
     * If game has a selected blueprint, it draws a preview of it instead
     */
    private readonly hover = (event: MouseEvent): void => {
        this.render();
        let x = event.x;
        let y = event.y;

        x -= this.settings.canvas.offsetLeft;
        y -= this.settings.canvas.offsetTop;

        /** Allow the Snap to grid functionality */
        if (this.settings.snapToGrid) {
            x = Math.floor(x / this.settings.resolution);
            y = Math.floor(y / this.settings.resolution);
        }

        // console.log(`hover: x: ${x} y: ${y}`); */
        if (this.state.hasSelectedBlueprint) {
            this.previewBlueprint(x, y, this.state.selectedBlueprint);
        } else {
            this.cellPreview(x, y);
        }
    };

    /** Draw the selected cell in case of mouse over event in red color, does not change the state */
    private cellPreview(x: number, y: number) {
        this.settings.context.fillStyle = "rgba(255,0,0,0.6)";
        const posx = x * this.settings.resolution;
        const posy = y * this.settings.resolution;
        this.settings.context.fillRect(posx + 1, posy + 1, this.settings.resolution - 2, this.settings.resolution - 2);
    }

    /**
     * Clears the canvas
     */
    private clearDisplay(): void {
        this.settings.context.clearRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
    }

    /**
     * Sums the 3x3 area around the selected cell, the selected cell is in the middle
     * @param cell Cell of which the neighbours are summed
     */
    private sumNeighbours(cell: Cell): number {
        let sum = 0;
        const x = cell.x;
        const y = cell.y;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                /** Check for out of bounds, out of bounds positions are treated as DEAD cells */
                if ((y + i) >= 0 && (y + i) < this.cols && (x + j) >= 0 && (x + j) < this.rows) {
                    sum += this.cells[x + j][y + i].state;
                }
            }
        }
        return sum;
    }

    /**
     * Shrinks the game board to the new size, cells that are outside of the new board size are removed
     * @param {number} resolution New resolution
     * @param {number} newRows New number of rows after shrinkage
     * @param {number} newCols New number of columns after shrinkage
     */
    private shrink(resolution: number, newRows: number, newCols: number) {
        /** New board */
        let newCells: Cell[][];
        newCells = [];
        /** Copy the old board into the new board, but only the cells that are within the new size */
        for (let i = 0; i < newRows; i++) {
            newCells[i] = [];
            for (let j = 0; j < newCols; j++) {
                newCells[i][j] = this.cells[i][j];
                /** Update the cells size */
                newCells[i][j].setSize(resolution, resolution);
            }
        }
        /** Replace the old board with the new board */
        this.cells = newCells;
    }

    /**
     * Expands the board with the new cells, marked as DEAD
     * @param {number} resolution New resolution
     * @param {number} newRows New number of rows
     * @param {number} newCols New number of columns
     */
    private expand(resolution: number, newRows: number, newCols: number) {
        /** New board */
        let newCells: Cell[][];
        newCells = [];
        /** Initialize the new board with DEAD cells */
        for (let i = 0; i < newRows; i++) {
            newCells[i] = [];
            for (let j = 0; j < newCols; j++) {
                newCells[i][j] = new Cell(i, j, resolution);
            }
        }
        /** Copy the old cells into the new board */
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newCells[i][j] = this.cells[i][j];
                /** Resize the old cells with the new resolution */
                newCells[i][j].setSize(resolution, resolution);
            }
        }
        /** Replace the old board with the new board */
        this.cells = newCells;
    }
}

export default Game;
