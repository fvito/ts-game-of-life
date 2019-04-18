export class Chrono {
    /**
     * Is timer running at the moment
     * @type {boolean}
     */
    private isRunning = false;
    /**
     * Start date of timing, used for calculating the difference
     */
    private startDate: Date;

    /**
     * Creates a new timer with provided time
     * @param {Date} startDate Start date used for calculating the difference defaults to now
     */
    constructor(startDate: Date = new Date()) {
        this.startDate = startDate;
    }

    /**
     * Starts the timer if it is not running
     */
    public startTiming() {
        if (!this.isRunning) {
           this.startDate = new Date();
        }
    }

    /**
     * Stops the timer and returns a time between start and stop
     * @returns {number} Time in millisecond since start of timing
     */
    public stopTiming(): number {
        this.isRunning = false;
        const now = new Date();
        return Math.max(0, now.getMilliseconds() - this.startDate.getMilliseconds());
    }
}
export default Chrono;
