import Blueprint from "../blueprint";
import {Cell, State} from "../cell";

class RLEParser {

    private static instance: RLEParser;
    private readonly pattern = new RegExp("(\\d+)|(\\w)|(!)|(\\$)", "g");

    private constructor() {

    };

    public parse(line: string, x: number, y: number): State[][] | any {
        const tokens = line.match(this.pattern);
        if (tokens === null || tokens === undefined) {
            console.error("Invalid RLE line");
            return null;
        }
        const states: State[][] = [];
        for (let i = 0; i < y; i++) {
            states[i] = [];
            for (let j = 0; j < x; j++) {
                states[i][j] = 0;
            }
        }
        let currentNumber = 1;
        let row = 0;
        let column = 0;
        for (const token of tokens) {
            if (!isNaN(Number(token))) {
                currentNumber = Number(token);
            } else if (token === "b") {
                // dead cell */
                // console.log(`${currentNumber} dead cells`); */
                column += currentNumber;
                currentNumber = 1;
            } else if (token === "o") {
                // alive cell */
                // console.log(`${currentNumber} alive cell`); */
                for (let i = 0; i < currentNumber; i++) {
                    states[row][column + i] = 1;
                }
                column += currentNumber;
                currentNumber = 1;
            } else if (token === "$") {
                // end of line */
                // console.log("new line"); */
                column = 0;
                row += currentNumber;
                currentNumber = 1;
            } else if (token === "!") {
                // end of pattern */
                // console.log("end of pattern") */
            }
        }
        return states;
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }
}

const instance = RLEParser.Instance;
export default instance;
