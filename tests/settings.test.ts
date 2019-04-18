import {expect} from "chai"
import "mocha"
import {instance, mock, verify, when} from "ts-mockito"
import {Settings} from "../src/settings";

describe("Settings", () => {
    let mockedCanvas: HTMLCanvasElement;
    beforeEach(() => {
        mockedCanvas = mock(HTMLCanvasElement);
    });

    it("constructor", () => {
        when(mockedCanvas.width).thenReturn(10);
        when(mockedCanvas.height).thenReturn(10);

        const canvas = instance(mockedCanvas);
        const setting = new Settings(canvas, 10);

        expect(setting.canvas).to.equal(canvas);
        verify(mockedCanvas.getContext("2d")).once();
        expect(setting.resolution).to.equal(10);
    });

    describe("resolution", () => {
        it("getter", () => {
            const canvas = instance(mockedCanvas);
            const setting = new Settings(canvas, 10);
            expect(setting.resolution).to.equal(10);
        });
        it("setter", () => {
            const canvas = instance(mockedCanvas);
            const setting = new Settings(canvas, 10);
            setting.resolution = 20;
            expect(setting.resolution).to.equal(20);
        });
    });

    it("width getter", () => {
        when(mockedCanvas.width).thenReturn(10);
        const canvas = instance(mockedCanvas);
        const setting = new Settings(canvas, 10);
        expect(setting.width).to.equal(10);
    });

    it("height getter", () => {
        when(mockedCanvas.height).thenReturn(10);
        const canvas = instance(mockedCanvas);
        const setting = new Settings(canvas, 10);
        expect(setting.height).to.equal(10);
    });
});
