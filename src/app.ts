import Blueprint from "./blueprint";
import Cell, {State} from "./cell";
import Game from "./game";
import RLEParser from "./parsers/rle_parser";
import Settings from "./settings";

interface JQuery {
    fadeIn(): JQuery;

    fadeOut(): JQuery;

    focus(): JQuery;

    html(): string;

    html(val: string): JQuery;

    show(): JQuery;

    addClass(className: string): JQuery;

    removeClass(className: string): JQuery;

    append(el: HTMLElement): JQuery;

    val(): string;

    val(value: string): JQuery;

    attr(attrName: string): string;

    change(param: () => any): void;
}

declare var $: {
    (el: HTMLElement | string): JQuery;
    (readyCallback: () => void): JQuery;
};

class App {

    private readonly game: Game;
    private readonly canvas: HTMLCanvasElement;
    private readonly blueprints: Blueprint[];
    private blueprintsList!: HTMLElement;

    constructor(canvasId: string) {
        const resolution = 10;
        this.blueprints = [];
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        this.sizeCanvas(resolution);

        this.setupCallbacks();

        this.game = new Game(new Settings(this.canvas, resolution));
        this.game.initBoard();

        this.populateInitialBlueprintList();
    }

    /**
     * Sets up all the callbacks for the ui elements
     */
    private setupCallbacks() {
        this.bindEvent("#showSettings", "click", () => {
            this.toggleSidebar("#settings");
        });
        this.bindEvent("#closeSettings", "click", () => {
            this.toggleSidebar("#settings");
        });

        this.bindEvent("#showBlueprints", "click", () => {
            this.toggleSidebar("#blueprints");
        });

        this.bindEvent("#closeBlueprints", "click", () => {
            this.toggleSidebar("#blueprints");
        });

        this.bindEvent("#clearBlueprintBtn", "click", () => {
            this.game.clearSelectedBlueprint();
            this.updateElement("#selectedBlueprintLabel", (element) => {
                const other = document.querySelector(".list-group-item.list-group-item-action.active") as HTMLElement;
                if (other !== null && other !== undefined) {
                    other.classList.remove("active");
                }
                const label = element as HTMLParagraphElement;
                label.innerText = `Selected blueprint: None`;
            });
        });
        this.bindEvent("#applySettingsBtn", "click", () => {
            this.applySettings();
        });
        this.bindEvent("#stepBtn", "click", () => {
            this.game.step();
        });
        this.bindEvent("#resetBtn", "click", () => {
            this.game.randomBoard();
        });
        this.bindEvent("#clearBtn", "click", () => {
            this.game.clearBoard();
        });
        this.bindEvent("#runBtn", "click", () => {
            this.game.run();
            this.updateElement("#runBtn", (element: HTMLElement) => {
                if (this.game.isRunning()) {
                    element.children.item(0).classList.replace("fa-play", "fa-pause");
                } else {
                    element.children.item(0).classList.replace("fa-pause", "fa-play");
                }
            });
        });
        this.bindEvent("#gridCb", "change", () => {
            const checkbox = document.getElementById("gridCb") as HTMLInputElement;
            this.game.settings.showGrid = checkbox.checked;
        });
        this.bindEvent("#snapCb", "change", () => {
            const checkbox = document.getElementById("snapCb") as HTMLInputElement;
            this.game.settings.snapToGrid = checkbox.checked;
        });
        this.bindEvent("#infoCb", "change", () => {
            const checkbox = document.getElementById("infoCb") as HTMLInputElement;
            this.game.settings.showInfo = checkbox.checked;
        });
        this.bindEvent("#fpsSlider", "input", (event) => {
            const ele = event.target as HTMLInputElement;
            this.updateElement("#fpsSliderLabel", (element: HTMLElement) => {
                element.innerText = `FPS: ${ele.value}`;
            });
            this.game.settings.fps = Number(ele.value);
        });
        this.bindEvent("#resolutionSlider", "input", (event) => {
            const ele = event.target as HTMLInputElement;
            const value = Number(ele.value);
            this.updateElement("#resolutionSliderLabel", (element: HTMLElement) => {
                element.innerText = `Resolution: ${value}`;
            });
            this.game.settings.resolution = value;
            this.sizeCanvas(value);
            this.game.resize(value);
        });

        const list = document.querySelector("#blueprintsList") as HTMLDivElement;
        if (list !== null && list !== undefined) {
            this.blueprintsList = list;
            for (let i = 0; i < list.children.length; i++) {
                const child = list.children.item(i) as HTMLElement;
                child.addEventListener("click", this.blueprintsListClick(child));
            }
        }

        this.bindEvent("#addNewBlueprint", "click", () => {
            this.loadBlueprint();
        });

    }

    /**
     * Populates the blueprints list with predefined blueprints
     */
    private populateInitialBlueprintList(): void {
        this.addNewBlueprint("Glasses", `4bo8bo4b$2b3o8b3o2b$bo14bob$bo2b3o4b3o2bob$2obo3bo2bo3bob2o$3bo3b4o3bo3b$3bo3bo2bo3bo3b$4b3o4b3o4b2$4b2obo2bob2o4b$4bob2o2b2obo!`, 18, 11);
        this.addNewBlueprint("Carnival shuttle", `33bo3bo$2o3b2o26b5o$bobobo3bo2bo6b2o3bo2bo7bo2b$
                        b2ob2o2b2o3b2o4b2o2b2o3b2o4bobob$bobobo3bo2bo6b2o3bo2bo7bo2b$2o3b2o26b5o$33bo3bo!`, 38, 7);
        this.addNewBlueprint("Glider", `bob$2bo$3o!`, 3, 3);
        this.addNewBlueprint("T-nosed P4", `4b3o4b$5bo5b2$4b3o4b$3bo3bo3b$2bo5bo2b$2bobobobo2b$b2obobob2ob$o2b2ob2o2bo$2o7b2o!`, 11, 10);
        this.addNewBlueprint("Gosper glider gun", `24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!`, 36, 9);
        this.addNewBlueprint("Garden of Eden 5", `b3o2b2o3b$b2obobob3o$b3o2b5o$obobobobobo$4obobobob$4b3o4b$bobobob4o$obobobobobo$5o2b3ob$3obobob2ob$3b2o2b3o!`, 11, 11);
        this.addNewBlueprint("Pulsar", `2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!`, 13, 13);
        this.addNewBlueprint("Quasar", `10b3o3b3o10b2$8bo4bobo4bo8b$8bo4bobo4bo8b$8bo4bobo4bo8b$10b3o3b3o10b2$
            8b3o7b3o8b$2b3o2bo4bo3bo4bo2b3o2b$7bo4bo3bo4bo7b$o4bobo4bo3bo4bobo4bo$
            o4bo17bo4bo$o4bo2b3o7b3o2bo4bo$2b3o19b3o2b2$2b3o19b3o2b$o4bo2b3o7b3o2b
            o4bo$o4bo17bo4bo$o4bobo4bo3bo4bobo4bo$7bo4bo3bo4bo7b$2b3o2bo4bo3bo4bo
            2b3o2b$8b3o7b3o8b2$10b3o3b3o10b$8bo4bobo4bo8b$8bo4bobo4bo8b$8bo4bobo4b
            o8b2$10b3o3b3o!`, 29, 29);
    }

    private applySettings() {
        console.log("Apply settings");
    }

    /**
     * Add a new blueprint to the blueprints list
     */
    private loadBlueprint(): void {
        const inputEl = document.querySelector("#rleContents") as HTMLTextAreaElement;
        const contents = inputEl.value.split("\n");
        console.log(contents);
        let name = "";
        let x = 0;
        let y = 0;
        let rle = "";
        for (let line of contents) {
            if (line[0] === "#" && line[1] === "N") {
                /** This is the name of the pattern, we need it to display it in the UI */
                name = line.substr(3);
            } else if (line[0] === "#") {
                /** Skip any other comments, for future use(would be nice to display pattern author) */
                continue;
            } else if (line[0] === "x") {
                /* Line with pattern width, height and rule set
                 *  We remove all spaces for easier parsing and split the values */
                line = line.replace(/\s/g, "");
                const values = line.split(",");
                for (const value of values) {
                    if (value[0] === "x") {
                        /** Parsing of X value, find the start position of = and parse the right hand side ie. the number */
                        const index = value.indexOf("=");
                        x = Number(value.substr(index + 1));
                    } else if (value[0] === "y") {
                        /** Parsing of Y value, find the start position of = and parse the right hand side ie. the number */
                        const index = value.indexOf("=");
                        y = Number(value.substr(index + 1));
                    }
                }
            } else {
                /** Any other line should be rle encoded pattern so just add the lines together for the parser later */
                rle += line;
            }
        }
        /** Create a new blueprint with the parsed values */
        this.addNewBlueprint(name, rle, x, y);
    }

    /**
     * Parses the pattern and adds it to the blueprint list
     * @param {string} name Name of the pattern
     * @param {string} pattern RLE encoded pattern
     * @param {number} x Width of pattern
     * @param {number} y Height of pattern
     */
    private addNewBlueprint(name: string, pattern: string, x: number, y: number): void {
        const tmp = RLEParser.parse(pattern, x, y);
        this.updateBlueprintsList(new Blueprint(x, y, tmp, name));
    }

    /**
     * Binds an event to the element
     * @param {string} selector Selector for the element
     * @param {string} event Event which we bind to
     * @param {(event: any) => any} action The action for the event
     */
    private bindEvent(selector: string, event: string, action: (event: any) => any): void {
        const element = document.body.querySelector(selector) as HTMLElement;
        if (element !== null && element !== undefined) {
            element.addEventListener(event, action);
        }
    }

    /**
     * Updates the provided element
     * @param {string} selector Selector for which element
     * @param {(element: any) => any} action Action to do on the provided element
     */
    private updateElement(selector: string, action: (element: any) => any): void {
        const element = document.body.querySelector(selector) as HTMLElement;
        if (element !== null && element !== undefined) {
            action(element);
        }
    }

    /**
     * Toggles the sidebar on or off
     * @param {string} selector Which sidebar to toggle
     */
    private toggleSidebar(selector: string): void {
        const sidebar = document.querySelector(selector);
        if (sidebar !== null && sidebar !== undefined) {
            if (sidebar.classList.contains("hidden")) {
                sidebar.classList.replace("hidden", "shown");
            } else {
                sidebar.classList.replace("shown", "hidden");
            }
        }
    }

    /**
     * Calculates and sets the canvas size according to the page size, in order for canvas to take up as much space as possible
     * @param {number} resolution
     */
    private sizeCanvas(resolution: number) {
        const parent = this.canvas.parentElement as HTMLDivElement;

        this.canvas.width = Math.floor((parent.offsetWidth - 40) / resolution) * resolution;
        this.canvas.height = Math.floor((window.outerHeight - 200) / resolution) * resolution;

        this.canvas.style.marginLeft = "20px";
        this.canvas.style.marginRight = "20px";
    }

    /**
     * Click event listener for items in the blueprints list
     * @param {HTMLElement} child Item in the blueprints list
     * @returns {any}
     */
    private blueprintsListClick(child: HTMLElement): any {
        const other = document.querySelector(".list-group-item.list-group-item-action.active") as HTMLElement;
        if (other !== null && other !== undefined) {
            other.classList.remove("active");
        }
        child.classList.add("active");
        /* tslint:disable-next-line */
        const id = Number(child.dataset["id"]);
        const blueprint = this.blueprints[id];
        this.game.selectBlueprint(blueprint);
        this.updateElement("#selectedBlueprintLabel", (element) => {
            const label = element as HTMLParagraphElement;
            label.innerText = `Selected blueprint: ${blueprint.name}`;
        });
    }

    /**
     * Creates and append new item to the blueprints list with the provided blueprint
     * @param {Blueprint} blueprint New blueprint to add
     */
    private updateBlueprintsList(blueprint: Blueprint) {
        this.blueprints.push(blueprint);
        const item = document.createElement("div");
        item.innerText = blueprint.name;
        item.classList.add("list-group-item", "list-group-item-action");
        /* tslint:disable-next-line */
        item.dataset["id"] = String(this.blueprints.length - 1);
        item.addEventListener("click", () => {
            this.blueprintsListClick(item);
        });
        this.blueprintsList.appendChild(item);
    }
}

// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    // tslint:disable
    new App("canvas");
});
