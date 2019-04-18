import {expect} from "chai"
import "mocha"
import {Blueprint} from "../src/blueprint";
import {State} from "../src/cell";

describe("Blueprint", () => {
    it("Constructor", () => {
        const x = 5;
        const y = 5;
        const states: State[][] = [];
        const name = "Test";
        const blueprint = new Blueprint(x, y, states, name);
        expect(blueprint.x).to.be.equal(x);
        expect(blueprint.y).to.be.equal(y);
        expect(blueprint.name).to.be.equal(name);
        expect(blueprint.cells).to.be.equal(states);
    });

    it("Blueprint without name should be named Unknown", () => {
        const x = 5;
        const y = 5;
        const states: State[][] = [];
        const name = "Unknown";
        const blueprint = new Blueprint(x, y, states);
        expect(blueprint.x).to.be.equal(x);
        expect(blueprint.y).to.be.equal(y);
        expect(blueprint.name).to.be.equal(name);
        expect(blueprint.cells).to.be.equal(states);
    });
});
