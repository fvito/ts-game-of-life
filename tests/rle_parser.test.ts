import {expect} from "chai"
import "mocha"
import {State} from "../src/cell";
import RLEParser from "../src/parsers/rle_parser";

describe("RLE Parser", () => {
    it("Invalid RLE line should return null", () => {
        expect(RLEParser.parse(" ", 5, 5)).to.be.equal(null);
    });

    it("RLE should be parsed correctly (GLIDER)", () => {
        const states: State[][] = [ [0, 1, 0],
                                    [0, 0, 1],
                                    [1, 1, 1]];
        const result = RLEParser.parse("bo$2bo$3o!", 3, 3);
        expect(result).to.have.deep.members(states);
    });

    it("Empty RLE should return empty states", () => {
        const empty: State[][] = [ [0, 0, 0],
                                   [0, 0, 0],
                                   [0, 0, 0]];
        const result = RLEParser.parse("!", 3, 3);
        expect(result).to.have.deep.members(empty);
    });

    it("Parsed result should match the provided dimensions", () => {
        const states: State[][] = [ [0, 1, 0],
                                    [0, 0, 1],
                                    [1, 1, 1]];
        const result = RLEParser.parse("bo$2bo$3o!", 3, 3);
        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.have.lengthOf(3);
    })

});
