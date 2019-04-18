/**
 * Holds game state and settings
 */
export class Settings {

    /**
     * Canvas element we draw to
     */
    public canvas: HTMLCanvasElement;
    /**
     * Context to draw with
     */
    public context: CanvasRenderingContext2D;

    /**
     * Is snap to grid enabled
     */
    public snapToGrid = true;

    /**
     * Is show grid enabled
     */
    public showGrid = true;

    /**
     * Display game info box
     * @type {boolean}
     */
    public showInfo = false;

    /**
     * Fps at witch the game is being drawn/updated
     * @type {number}
     */
    public fps = 24;

    /**
     * Canvas height
     */
    private readonly _height: number;

    /**
     * Canvas width
     */
    private readonly _width: number;

    /**
     * Game resolution, grid size, cells width and height
     */
    private _resolution: number;

    /**
     * Initializes the settings
     * @param canvas Canvas element we use to draw to
     * @param resolution The desired resolution
     */
    constructor(canvas: HTMLCanvasElement, resolution: number) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
        this._width = canvas.width;
        this._height = canvas.height;
        this._resolution = resolution;
    }

    /**
     * Returns the canvas width
     * @returns {number} Canvas width
     */
    get width(): number {
        return this._width;
    }

    /**
     * Returns the canvas height
     * @returns {number} Canvas height
     */
    get height(): number {
        return this._height;
    }

    /**
     * Returns the current resolution
     * @returns {number} Current resolution
     */
    get resolution(): number {
        return this._resolution;
    }

    /**
     * Sets the resolution to a new value
     * @param {number} value New resolution value
     */
    set resolution(value: number) {
        this._resolution = value;
    }
}

export default Settings;
