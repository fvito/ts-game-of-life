import {expect} from "chai"
import "mocha"
import {Cell, State} from "../src/cell";

describe("Cell", () => {
    let cell: Cell;
    beforeEach(() => {
        cell = new Cell(10, 20, 30);
    });

    it("swapSate() should swap states", () => {
        cell.state = State.ALIVE;
        cell.nextState = State.DEAD;
        cell.swapState();
        expect(cell.state).to.equal(State.DEAD);
    });

    it("setState() should set state and next state", () => {
        cell.setState(State.ALIVE);
        expect(cell.state).to.equal(State.ALIVE);
        expect(cell.nextState).to.equal(State.ALIVE);
    });

    it("constructor should set x, y and width/height", () => {
        expect(cell.x).to.equal(10);
        expect(cell.y).to.equal(20);
        expect(cell.width).to.equal(30);
        expect(cell.height).to.equal(30);
        expect(cell.state).to.equal(State.DEAD);
        expect(cell.nextState).to.equal(State.DEAD);
    });

    it("constructor with state should set both current and next state to the same value", () => {
        const aliveCell = new Cell(10, 20, 30, State.ALIVE);
        expect(aliveCell.x).to.equal(10);
        expect(aliveCell.y).to.equal(20);
        expect(aliveCell.width).to.equal(30);
        expect(aliveCell.height).to.equal(30);
        expect(aliveCell.state).to.equal(State.ALIVE);
        expect(aliveCell.nextState).to.equal(State.ALIVE);
    });

    it("setSize() should set both width and height", () => {
        cell.setSize(10, 20);
        expect(cell.width).to.equal(10);
        expect(cell.height).to.equal(20);
    })

});
