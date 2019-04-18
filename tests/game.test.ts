import { expect } from "chai"
import "mocha"
import {instance, mock, verify, when} from "ts-mockito"
import { Game } from "../src/game";
import {Settings} from "../src/settings";

describe("Game", () => {
    let mockedSettings: Settings;

    beforeEach(() => {
        mockedSettings = mock(Settings);
    });

    it("Constructor", () => {
                
       when(mockedSettings.height).thenReturn(10);
       when(mockedSettings.width).thenReturn(10);
       when(mockedSettings.resolution).thenReturn(10);

       const settings = instance(mockedSettings);

       const game = new Game(settings);
       expect(game.settings).to.equal(settings);
       expect(game.alive).to.equal(0);
       expect(game.rows).to.equal(1);
       expect(game.cols).to.equal(1);
    });
});
