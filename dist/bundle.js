/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blueprint_1 = __importDefault(__webpack_require__(/*! ./blueprint */ "./src/blueprint.ts"));
var game_1 = __importDefault(__webpack_require__(/*! ./game */ "./src/game.ts"));
var rle_parser_1 = __importDefault(__webpack_require__(/*! ./parsers/rle_parser */ "./src/parsers/rle_parser.ts"));
var settings_1 = __importDefault(__webpack_require__(/*! ./settings */ "./src/settings.ts"));
var App = /** @class */ (function () {
    function App(canvasId) {
        var resolution = 10;
        this.blueprints = [];
        this.canvas = document.getElementById(canvasId);
        this.sizeCanvas(resolution);
        this.setupCallbacks();
        this.game = new game_1.default(new settings_1.default(this.canvas, resolution));
        this.game.initBoard();
        this.populateInitialBlueprintList();
    }
    /**
     * Sets up all the callbacks for the ui elements
     */
    App.prototype.setupCallbacks = function () {
        var _this = this;
        this.bindEvent("#showSettings", "click", function () {
            _this.toggleSidebar("#settings");
        });
        this.bindEvent("#closeSettings", "click", function () {
            _this.toggleSidebar("#settings");
        });
        this.bindEvent("#showBlueprints", "click", function () {
            _this.toggleSidebar("#blueprints");
        });
        this.bindEvent("#closeBlueprints", "click", function () {
            _this.toggleSidebar("#blueprints");
        });
        this.bindEvent("#clearBlueprintBtn", "click", function () {
            _this.game.clearSelectedBlueprint();
            _this.updateElement("#selectedBlueprintLabel", function (element) {
                var other = document.querySelector(".list-group-item.list-group-item-action.active");
                if (other !== null && other !== undefined) {
                    other.classList.remove("active");
                }
                var label = element;
                label.innerText = "Selected blueprint: None";
            });
        });
        this.bindEvent("#applySettingsBtn", "click", function () {
            _this.applySettings();
        });
        this.bindEvent("#stepBtn", "click", function () {
            _this.game.step();
        });
        this.bindEvent("#resetBtn", "click", function () {
            _this.game.randomBoard();
        });
        this.bindEvent("#clearBtn", "click", function () {
            _this.game.clearBoard();
        });
        this.bindEvent("#runBtn", "click", function () {
            _this.game.run();
            _this.updateElement("#runBtn", function (element) {
                if (_this.game.isRunning()) {
                    element.children.item(0).classList.replace("fa-play", "fa-pause");
                }
                else {
                    element.children.item(0).classList.replace("fa-pause", "fa-play");
                }
            });
        });
        this.bindEvent("#gridCb", "change", function () {
            var checkbox = document.getElementById("gridCb");
            _this.game.settings.showGrid = checkbox.checked;
        });
        this.bindEvent("#snapCb", "change", function () {
            var checkbox = document.getElementById("snapCb");
            _this.game.settings.snapToGrid = checkbox.checked;
        });
        this.bindEvent("#infoCb", "change", function () {
            var checkbox = document.getElementById("infoCb");
            _this.game.settings.showInfo = checkbox.checked;
        });
        this.bindEvent("#fpsSlider", "input", function (event) {
            var ele = event.target;
            _this.updateElement("#fpsSliderLabel", function (element) {
                element.innerText = "FPS: " + ele.value;
            });
            _this.game.settings.fps = Number(ele.value);
        });
        this.bindEvent("#resolutionSlider", "input", function (event) {
            var ele = event.target;
            var value = Number(ele.value);
            _this.updateElement("#resolutionSliderLabel", function (element) {
                element.innerText = "Resolution: " + value;
            });
            _this.game.settings.resolution = value;
            _this.sizeCanvas(value);
            _this.game.resize(value);
        });
        var list = document.querySelector("#blueprintsList");
        if (list !== null && list !== undefined) {
            this.blueprintsList = list;
            for (var i = 0; i < list.children.length; i++) {
                var child = list.children.item(i);
                child.addEventListener("click", this.blueprintsListClick(child));
            }
        }
        this.bindEvent("#addNewBlueprint", "click", function () {
            _this.loadBlueprint();
        });
    };
    /**
     * Populates the blueprints list with predefined blueprints
     */
    App.prototype.populateInitialBlueprintList = function () {
        this.addNewBlueprint("Glasses", "4bo8bo4b$2b3o8b3o2b$bo14bob$bo2b3o4b3o2bob$2obo3bo2bo3bob2o$3bo3b4o3bo3b$3bo3bo2bo3bo3b$4b3o4b3o4b2$4b2obo2bob2o4b$4bob2o2b2obo!", 18, 11);
        this.addNewBlueprint("Carnival shuttle", "33bo3bo$2o3b2o26b5o$bobobo3bo2bo6b2o3bo2bo7bo2b$\n                        b2ob2o2b2o3b2o4b2o2b2o3b2o4bobob$bobobo3bo2bo6b2o3bo2bo7bo2b$2o3b2o26b5o$33bo3bo!", 38, 7);
        this.addNewBlueprint("Glider", "bob$2bo$3o!", 3, 3);
        this.addNewBlueprint("T-nosed P4", "4b3o4b$5bo5b2$4b3o4b$3bo3bo3b$2bo5bo2b$2bobobobo2b$b2obobob2ob$o2b2ob2o2bo$2o7b2o!", 11, 10);
        this.addNewBlueprint("Gosper glider gun", "24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!", 36, 9);
        this.addNewBlueprint("Garden of Eden 5", "b3o2b2o3b$b2obobob3o$b3o2b5o$obobobobobo$4obobobob$4b3o4b$bobobob4o$obobobobobo$5o2b3ob$3obobob2ob$3b2o2b3o!", 11, 11);
        this.addNewBlueprint("Pulsar", "2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!", 13, 13);
        this.addNewBlueprint("Quasar", "10b3o3b3o10b2$8bo4bobo4bo8b$8bo4bobo4bo8b$8bo4bobo4bo8b$10b3o3b3o10b2$\n            8b3o7b3o8b$2b3o2bo4bo3bo4bo2b3o2b$7bo4bo3bo4bo7b$o4bobo4bo3bo4bobo4bo$\n            o4bo17bo4bo$o4bo2b3o7b3o2bo4bo$2b3o19b3o2b2$2b3o19b3o2b$o4bo2b3o7b3o2b\n            o4bo$o4bo17bo4bo$o4bobo4bo3bo4bobo4bo$7bo4bo3bo4bo7b$2b3o2bo4bo3bo4bo\n            2b3o2b$8b3o7b3o8b2$10b3o3b3o10b$8bo4bobo4bo8b$8bo4bobo4bo8b$8bo4bobo4b\n            o8b2$10b3o3b3o!", 29, 29);
    };
    App.prototype.applySettings = function () {
        console.log("Apply settings");
    };
    /**
     * Add a new blueprint to the blueprints list
     */
    App.prototype.loadBlueprint = function () {
        var inputEl = document.querySelector("#rleContents");
        var contents = inputEl.value.split("\n");
        console.log(contents);
        var name = "";
        var x = 0;
        var y = 0;
        var rle = "";
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var line = contents_1[_i];
            if (line[0] === "#" && line[1] === "N") {
                /** This is the name of the pattern, we need it to display it in the UI */
                name = line.substr(3);
            }
            else if (line[0] === "#") {
                /** Skip any other comments, for future use(would be nice to display pattern author) */
                continue;
            }
            else if (line[0] === "x") {
                /* Line with pattern width, height and rule set
                 *  We remove all spaces for easier parsing and split the values */
                line = line.replace(/\s/g, "");
                var values = line.split(",");
                for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
                    var value = values_1[_a];
                    if (value[0] === "x") {
                        /** Parsing of X value, find the start position of = and parse the right hand side ie. the number */
                        var index = value.indexOf("=");
                        x = Number(value.substr(index + 1));
                    }
                    else if (value[0] === "y") {
                        /** Parsing of Y value, find the start position of = and parse the right hand side ie. the number */
                        var index = value.indexOf("=");
                        y = Number(value.substr(index + 1));
                    }
                }
            }
            else {
                /** Any other line should be rle encoded pattern so just add the lines together for the parser later */
                rle += line;
            }
        }
        /** Create a new blueprint with the parsed values */
        this.addNewBlueprint(name, rle, x, y);
    };
    /**
     * Parses the pattern and adds it to the blueprint list
     * @param {string} name Name of the pattern
     * @param {string} pattern RLE encoded pattern
     * @param {number} x Width of pattern
     * @param {number} y Height of pattern
     */
    App.prototype.addNewBlueprint = function (name, pattern, x, y) {
        var tmp = rle_parser_1.default.parse(pattern, x, y);
        this.updateBlueprintsList(new blueprint_1.default(x, y, tmp, name));
    };
    /**
     * Binds an event to the element
     * @param {string} selector Selector for the element
     * @param {string} event Event which we bind to
     * @param {(event: any) => any} action The action for the event
     */
    App.prototype.bindEvent = function (selector, event, action) {
        var element = document.body.querySelector(selector);
        if (element !== null && element !== undefined) {
            element.addEventListener(event, action);
        }
    };
    /**
     * Updates the provided element
     * @param {string} selector Selector for which element
     * @param {(element: any) => any} action Action to do on the provided element
     */
    App.prototype.updateElement = function (selector, action) {
        var element = document.body.querySelector(selector);
        if (element !== null && element !== undefined) {
            action(element);
        }
    };
    /**
     * Toggles the sidebar on or off
     * @param {string} selector Which sidebar to toggle
     */
    App.prototype.toggleSidebar = function (selector) {
        var sidebar = document.querySelector(selector);
        if (sidebar !== null && sidebar !== undefined) {
            if (sidebar.classList.contains("hidden")) {
                sidebar.classList.replace("hidden", "shown");
            }
            else {
                sidebar.classList.replace("shown", "hidden");
            }
        }
    };
    /**
     * Calculates and sets the canvas size according to the page size, in order for canvas to take up as much space as possible
     * @param {number} resolution
     */
    App.prototype.sizeCanvas = function (resolution) {
        var parent = this.canvas.parentElement;
        this.canvas.width = Math.floor((parent.offsetWidth - 40) / resolution) * resolution;
        this.canvas.height = Math.floor((window.outerHeight - 200) / resolution) * resolution;
        this.canvas.style.marginLeft = "20px";
        this.canvas.style.marginRight = "20px";
    };
    /**
     * Click event listener for items in the blueprints list
     * @param {HTMLElement} child Item in the blueprints list
     * @returns {any}
     */
    App.prototype.blueprintsListClick = function (child) {
        var other = document.querySelector(".list-group-item.list-group-item-action.active");
        if (other !== null && other !== undefined) {
            other.classList.remove("active");
        }
        child.classList.add("active");
        /* tslint:disable-next-line */
        var id = Number(child.dataset["id"]);
        var blueprint = this.blueprints[id];
        this.game.selectBlueprint(blueprint);
        this.updateElement("#selectedBlueprintLabel", function (element) {
            var label = element;
            label.innerText = "Selected blueprint: " + blueprint.name;
        });
    };
    /**
     * Creates and append new item to the blueprints list with the provided blueprint
     * @param {Blueprint} blueprint New blueprint to add
     */
    App.prototype.updateBlueprintsList = function (blueprint) {
        var _this = this;
        this.blueprints.push(blueprint);
        var item = document.createElement("div");
        item.innerText = blueprint.name;
        item.classList.add("list-group-item", "list-group-item-action");
        /* tslint:disable-next-line */
        item.dataset["id"] = String(this.blueprints.length - 1);
        item.addEventListener("click", function () {
            _this.blueprintsListClick(item);
        });
        this.blueprintsList.appendChild(item);
    };
    return App;
}());
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    // Finally, we kick things off by creating the **App**.
    // tslint:disable
    new App("canvas");
});


/***/ }),

/***/ "./src/blueprint.ts":
/*!**************************!*\
  !*** ./src/blueprint.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Blueprint = /** @class */ (function () {
    /**
     * Creates a new blueprint
     * @param {number} x Width of the blueprint
     * @param {number} y Height of the blueprint
     * @param {State[][]} cells Cell states of the blueprint
     * @param {string} name Optional, blueprint name, defaults to Unknown
     */
    function Blueprint(x, y, cells, name) {
        if (name === void 0) { name = "Unknown"; }
        this.x = x;
        this.y = y;
        this.name = name;
        this.cells = cells;
    }
    return Blueprint;
}());
exports.Blueprint = Blueprint;
exports.default = Blueprint;


/***/ }),

/***/ "./src/cell.ts":
/*!*********************!*\
  !*** ./src/cell.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cells state
 */
var State;
(function (State) {
    State[State["DEAD"] = 0] = "DEAD";
    State[State["ALIVE"] = 1] = "ALIVE";
})(State = exports.State || (exports.State = {}));
var Cell = /** @class */ (function () {
    /**
     *
     * @param x X position of the cell on the board
     * @param y Y position of the cell on the board
     * @param resolution Game resolution, how wide and tall cell is
     * @param state Cells initial state
     */
    function Cell(x, y, resolution, state) {
        /**
         * Cells current state
         */
        this.state = State.DEAD;
        /**
         * Cells state for the next pass
         */
        this.nextState = State.DEAD;
        /**
         * Cells display color
         * @type {string}
         */
        this.color = "black";
        this.x = x;
        this.y = y;
        this.width = resolution;
        this.height = resolution;
        if (state) {
            this.state = state;
            this.nextState = state;
        }
        else {
            this.state = State.DEAD;
            this.nextState = State.DEAD;
        }
    }
    /**
     * Swaps the cells current state with the next state
     */
    Cell.prototype.swapState = function () {
        this.state = this.nextState;
    };
    /**
     * Set the both, current and next state to the same state
     * @param value Desired state
     */
    Cell.prototype.setState = function (value) {
        this.state = value;
        this.nextState = value;
    };
    /**
     * Sets the height and width of the cell
     * @param {number} width Desired width
     * @param {number} height Desired height
     */
    Cell.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    return Cell;
}());
exports.Cell = Cell;
exports.default = Cell;


/***/ }),

/***/ "./src/chrono.ts":
/*!***********************!*\
  !*** ./src/chrono.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Chrono = /** @class */ (function () {
    /**
     * Creates a new timer with provided time
     * @param {Date} startDate Start date used for calculating the difference defaults to now
     */
    function Chrono(startDate) {
        if (startDate === void 0) { startDate = new Date(); }
        /**
         * Is timer running at the moment
         * @type {boolean}
         */
        this.isRunning = false;
        this.startDate = startDate;
    }
    /**
     * Starts the timer if it is not running
     */
    Chrono.prototype.startTiming = function () {
        if (!this.isRunning) {
            this.startDate = new Date();
        }
    };
    /**
     * Stops the timer and returns a time between start and stop
     * @returns {number} Time in millisecond since start of timing
     */
    Chrono.prototype.stopTiming = function () {
        this.isRunning = false;
        var now = new Date();
        return Math.max(0, now.getMilliseconds() - this.startDate.getMilliseconds());
    };
    return Chrono;
}());
exports.Chrono = Chrono;
exports.default = Chrono;


/***/ }),

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cell_1 = __webpack_require__(/*! ./cell */ "./src/cell.ts");
var chrono_1 = __importDefault(__webpack_require__(/*! ./chrono */ "./src/chrono.ts"));
var game_state_1 = __importDefault(__webpack_require__(/*! ./game_state */ "./src/game_state.ts"));
var Game = /** @class */ (function () {
    /**
     *
     * @param settings Game settings
     */
    function Game(settings) {
        var _this = this;
        this.state = new game_state_1.default();
        this.chrono = new chrono_1.default();
        /**
         * Number of cells which changed their state to ALIVE during algorithm pass
         */
        this.alive = 0;
        /**
         * Current game generation
         * @type {number}
         */
        this.generation = 0;
        this.colors = ["crimson", "darkorange", "gold", "mediumpurple", "indigo", "limegreen", "teal", "black"];
        /**
         * Does one step of the Game of Life algorithm and assigns the next state to the cells.
         * Also keeps count of number of cells that changed their state to ALIVE
         */
        this.step = function () {
            /** Reset the alive counter */
            _this.alive = 0;
            _this.generation++;
            _this.chrono.startTiming();
            for (var i = 0; i < _this.rows; i++) {
                for (var j = 0; j < _this.cols; j++) {
                    var cell = _this.cells[i][j];
                    /** Sum the 3*3 neighbours around the currently selected cell */
                    var sum = _this.sumNeighbours(cell);
                    cell.color = _this.colors[sum];
                    if (sum === 4) {
                        cell.nextState = cell.state;
                    }
                    else if (sum === 3) {
                        _this.alive++;
                        cell.nextState = cell_1.State.ALIVE;
                    }
                    else {
                        cell.nextState = cell_1.State.DEAD;
                    }
                }
            }
            _this.state.stepTime = _this.chrono.stopTiming();
            /** Draw the board */
            _this.render();
            if (_this.alive === 0) {
                /** Stop the algorithm, there were no changes to the cells states */
                _this.state.running = false;
                return;
            }
            /** Wait to finish drawing and repeat the step if game state is in RUN mode */
            if (_this.state.running) {
                setTimeout(function () {
                    requestAnimationFrame(_this.step);
                }, 1000 / _this.settings.fps);
            }
        };
        /**
         * Canvas mouse click callback.
         * Decodes the click coordinate and changes the selected cells state or places the selected blueprint
         * - Left Button(0): Marks the selected cell as ALIVE or places the selected blueprint
         * - Right Button(2): Marks the selected cell as DEAD
         * Updates the selected cells display on the board
         *
         */
        this.place = function (event) {
            var x = event.x;
            var y = event.y;
            x -= _this.settings.canvas.offsetLeft;
            y -= _this.settings.canvas.offsetTop;
            x = Math.floor(x / _this.settings.resolution);
            y = Math.floor(y / _this.settings.resolution);
            // console.log(`place: x: ${x} y: ${y} event: ${event}`); */
            if (event.button === 0) {
                if (_this.state.hasSelectedBlueprint) {
                    _this.addBlueprint(x, y, _this.state.selectedBlueprint);
                }
                else {
                    _this.cells[y][x].setState(cell_1.State.ALIVE);
                }
            }
            else if (event.button === 2) {
                _this.cells[y][x].setState(cell_1.State.DEAD);
            }
            _this.updateCellDisplay(_this.cells[y][x]);
        };
        /**
         * Canvas mouse over event callback
         * Redraws the board and displays the currently selected cell under the mouse cursor as red color, does not change the cell state.
         * If game has a selected blueprint, it draws a preview of it instead
         */
        this.hover = function (event) {
            _this.render();
            var x = event.x;
            var y = event.y;
            x -= _this.settings.canvas.offsetLeft;
            y -= _this.settings.canvas.offsetTop;
            /** Allow the Snap to grid functionality */
            if (_this.settings.snapToGrid) {
                x = Math.floor(x / _this.settings.resolution);
                y = Math.floor(y / _this.settings.resolution);
            }
            // console.log(`hover: x: ${x} y: ${y}`); */
            if (_this.state.hasSelectedBlueprint) {
                _this.previewBlueprint(x, y, _this.state.selectedBlueprint);
            }
            else {
                _this.cellPreview(x, y);
            }
        };
        this.settings = settings;
        this.alive = 0;
        /** Game board size depends on the resolution */
        this.rows = this.settings.height / this.settings.resolution;
        this.cols = this.settings.width / this.settings.resolution;
    }
    /**
     * Adds event listeners to the canvas
     */
    Game.prototype.initCanvasEvents = function () {
        /** Listener for the left and right mouse click, invokes the place callback */
        this.settings.canvas.addEventListener("mousedown", this.place, false);
        /** Listener for the mouse hover, invokes the hover callback */
        this.settings.canvas.addEventListener("mousemove", this.hover, false);
    };
    /**
     * Initializes and draws the game with random cell placements
     */
    Game.prototype.initBoard = function () {
        this.initCells();
        this.initCanvasEvents();
        this.drawGrid();
    };
    /**
     * Populates the board with randomly assigned ALIVE cells
     */
    Game.prototype.randomBoard = function () {
        this.randomSeed();
        this.render();
        this.generation = 0;
    };
    /**
     * Clears the game board, all cells have state DEAD
     */
    Game.prototype.clearBoard = function () {
        this.initCells();
        this.render();
        this.generation = 0;
    };
    /**
     * Returns the game run state
     * @returns {boolean} True if game is in run state, false otherwise
     */
    Game.prototype.isRunning = function () {
        return this.state.running;
    };
    /**
     * Changes the game state and starts the algorithm
     */
    Game.prototype.run = function () {
        this.state.running = !this.state.running;
        this.step();
    };
    /**
     * Resizes the board with the new resolution, cells outside are deleted
     * @param {number} resolution Desired new resolution
     */
    Game.prototype.resize = function (resolution) {
        var newRows = this.settings.height / resolution;
        var newCols = this.settings.width / resolution;
        if (this.rows > newRows && this.cols > newCols) {
            this.shrink(resolution, newRows, newCols);
        }
        else {
            this.expand(resolution, newRows, newCols);
        }
        this.cols = newCols;
        this.rows = newRows;
        if (!this.state.running) {
            this.render();
        }
    };
    /**
     * Adds the provided blueprint(changes the cells state) to the board and redraws the board
     * @param {number} x X position where to place the blueprint
     * @param {number} y Y position where to place the blueprint
     * @param {Blueprint} blueprint Blueprint to add
     */
    Game.prototype.addBlueprint = function (x, y, blueprint) {
        for (var i = 0; i < blueprint.y; i++) {
            for (var j = 0; j < blueprint.x; j++) {
                this.cells[i + y][j + x].setState(blueprint.cells[i][j]);
            }
        }
        this.render();
    };
    /**
     * Previews the blueprint, does not change the underlying cells state
     * @param {number} x
     * @param {number} y
     * @param {Blueprint} blueprint
     */
    Game.prototype.previewBlueprint = function (x, y, blueprint) {
        for (var i = 0; i < blueprint.y; i++) {
            for (var j = 0; j < blueprint.x; j++) {
                if (blueprint.cells[i][j] === cell_1.State.ALIVE) {
                    this.cellPreview(j + x, i + y);
                }
            }
        }
    };
    /**
     * Marks the provided blueprint as selected for the preview and placement
     * @param {Blueprint} blueprint Blueprint to select
     */
    Game.prototype.selectBlueprint = function (blueprint) {
        this.state.selectedBlueprint = blueprint;
        this.state.hasSelectedBlueprint = true;
    };
    /**
     * Removes the selected blueprint
     */
    Game.prototype.clearSelectedBlueprint = function () {
        this.state.hasSelectedBlueprint = false;
    };
    /**
     * Randomly assigns ALIVE state to some cells
     */
    Game.prototype.randomSeed = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var cell = this.cells[i][j];
                if (Math.random() > 0.66) {
                    cell.setState(cell_1.State.ALIVE);
                }
            }
        }
    };
    /**
     * Initializes the board and cells in the board
     */
    Game.prototype.initCells = function () {
        this.cells = [];
        for (var i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.cells[i][j] = new cell_1.Cell(i, j, this.settings.resolution);
            }
        }
    };
    /**
     * Draw the grid on the canvas. Grid size depends on the resolution setting
     */
    Game.prototype.drawGrid = function () {
        this.settings.context.strokeStyle = "rgb(127,127,127)";
        /** Draw the rows, spaced by the resolution setting */
        for (var i = 0; i < this.rows; i++) {
            this.settings.context.beginPath();
            this.settings.context.moveTo(0, i * this.settings.resolution);
            this.settings.context.lineTo(this.settings.canvas.width, i * this.settings.resolution);
            this.settings.context.stroke();
        }
        /** Draw the columns, spaced by the resolution setting */
        for (var i = 0; i < this.cols; i++) {
            this.settings.context.beginPath();
            this.settings.context.moveTo(i * this.settings.resolution, this.settings.canvas.height);
            this.settings.context.lineTo(i * this.settings.resolution, 0);
            this.settings.context.stroke();
        }
    };
    /** Draws a single cell only if its state is ALIVE */
    Game.prototype.drawCell = function (cell) {
        this.settings.context.fillStyle = cell.color;
        if (cell.state === cell_1.State.ALIVE) {
            this.settings.context.fillRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        }
    };
    /** Re draws the selected cell depending on its state
     *  - Black if the cell is ALIVE
     *  - White if the cell is DEAD
     */
    Game.prototype.updateCellDisplay = function (cell) {
        if (cell.state === cell_1.State.ALIVE) {
            this.settings.context.fillRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        }
        else {
            this.settings.context.clearRect(cell.y * this.settings.resolution + 1, cell.x * this.settings.resolution + 1, cell.width - 2, cell.height - 2);
        }
    };
    /**
     * Draw only the alive cells on the canvas
     */
    Game.prototype.render = function () {
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
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var cell = this.cells[i][j];
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
    };
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
    Game.prototype.renderInfoBox = function () {
        var left = this.settings.width - 150;
        this.settings.context.fillStyle = "rgba(0,0,0,0.6)";
        this.settings.context.fillRect(left, 0, 180, 150);
        this.settings.context.fillStyle = "white";
        this.settings.context.fillText("Generation: " + this.generation, left + 15, 20, 150 - 25);
        this.settings.context.fillText("Alive: " + this.alive, left + 15, 35, 150 - 25);
        this.settings.context.fillText("Step time: " + this.state.stepTime + " ms", left + 15, 50, 150 - 25);
        this.settings.context.fillText("Swap state and draw time: " + this.state.swapTime + " ms", left + 15, 65, 150 - 25);
        this.settings.context.fillText("Grid draw time: " + this.state.drawTime + " ms", left + 15, 80, 150 - 25);
        this.settings.context.fillText("Total time: " + (this.state.stepTime + this.state.swapTime + this.state.drawTime) + " ms", left + 15, 95, 150 - 25);
        this.settings.context.fillText("FPS: " + this.settings.fps, left + 15, 110, 150 - 25);
        this.settings.context.fillText("Resolution: " + this.settings.resolution, left + 15, 125, 150 - 25);
    };
    /** Draw the selected cell in case of mouse over event in red color, does not change the state */
    Game.prototype.cellPreview = function (x, y) {
        this.settings.context.fillStyle = "rgba(255,0,0,0.6)";
        var posx = x * this.settings.resolution;
        var posy = y * this.settings.resolution;
        this.settings.context.fillRect(posx + 1, posy + 1, this.settings.resolution - 2, this.settings.resolution - 2);
    };
    /**
     * Clears the canvas
     */
    Game.prototype.clearDisplay = function () {
        this.settings.context.clearRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
    };
    /**
     * Sums the 3x3 area around the selected cell, the selected cell is in the middle
     * @param cell Cell of which the neighbours are summed
     */
    Game.prototype.sumNeighbours = function (cell) {
        var sum = 0;
        var x = cell.x;
        var y = cell.y;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                /** Check for out of bounds, out of bounds positions are treated as DEAD cells */
                if ((y + i) >= 0 && (y + i) < this.cols && (x + j) >= 0 && (x + j) < this.rows) {
                    sum += this.cells[x + j][y + i].state;
                }
            }
        }
        return sum;
    };
    /**
     * Shrinks the game board to the new size, cells that are outside of the new board size are removed
     * @param {number} resolution New resolution
     * @param {number} newRows New number of rows after shrinkage
     * @param {number} newCols New number of columns after shrinkage
     */
    Game.prototype.shrink = function (resolution, newRows, newCols) {
        /** New board */
        var newCells;
        newCells = [];
        /** Copy the old board into the new board, but only the cells that are within the new size */
        for (var i = 0; i < newRows; i++) {
            newCells[i] = [];
            for (var j = 0; j < newCols; j++) {
                newCells[i][j] = this.cells[i][j];
                /** Update the cells size */
                newCells[i][j].setSize(resolution, resolution);
            }
        }
        /** Replace the old board with the new board */
        this.cells = newCells;
    };
    /**
     * Expands the board with the new cells, marked as DEAD
     * @param {number} resolution New resolution
     * @param {number} newRows New number of rows
     * @param {number} newCols New number of columns
     */
    Game.prototype.expand = function (resolution, newRows, newCols) {
        /** New board */
        var newCells;
        newCells = [];
        /** Initialize the new board with DEAD cells */
        for (var i = 0; i < newRows; i++) {
            newCells[i] = [];
            for (var j = 0; j < newCols; j++) {
                newCells[i][j] = new cell_1.Cell(i, j, resolution);
            }
        }
        /** Copy the old cells into the new board */
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                newCells[i][j] = this.cells[i][j];
                /** Resize the old cells with the new resolution */
                newCells[i][j].setSize(resolution, resolution);
            }
        }
        /** Replace the old board with the new board */
        this.cells = newCells;
    };
    return Game;
}());
exports.Game = Game;
exports.default = Game;


/***/ }),

/***/ "./src/game_state.ts":
/*!***************************!*\
  !*** ./src/game_state.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GameState = /** @class */ (function () {
    function GameState() {
        /**
         * Is game in running state
         */
        this.running = false;
        /**
         * Time it took to do one step of algorithm
         * @type {number}
         */
        this.stepTime = 0;
        /**
         * Time it took to swap cells states and draws them
         * @type {number}
         */
        this.swapTime = 0;
        /**
         * Time it took to draw the board(grid)
         * @type {number}
         */
        this.drawTime = 0;
        /**
         *  Use the currently selected blueprint
         * @type {boolean}
         */
        this.hasSelectedBlueprint = false;
    }
    return GameState;
}());
exports.GameState = GameState;
exports.default = GameState;


/***/ }),

/***/ "./src/parsers/rle_parser.ts":
/*!***********************************!*\
  !*** ./src/parsers/rle_parser.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RLEParser = /** @class */ (function () {
    function RLEParser() {
        this.pattern = new RegExp("(\\d+)|(\\w)|(!)|(\\$)", "g");
    }
    ;
    RLEParser.prototype.parse = function (line, x, y) {
        var tokens = line.match(this.pattern);
        if (tokens === null || tokens === undefined) {
            console.error("Invalid RLE line");
            return null;
        }
        var states = [];
        for (var i = 0; i < y; i++) {
            states[i] = [];
            for (var j = 0; j < x; j++) {
                states[i][j] = 0;
            }
        }
        var currentNumber = 1;
        var row = 0;
        var column = 0;
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (!isNaN(Number(token))) {
                currentNumber = Number(token);
            }
            else if (token === "b") {
                // dead cell */
                // console.log(`${currentNumber} dead cells`); */
                column += currentNumber;
                currentNumber = 1;
            }
            else if (token === "o") {
                // alive cell */
                // console.log(`${currentNumber} alive cell`); */
                for (var i = 0; i < currentNumber; i++) {
                    states[row][column + i] = 1;
                }
                column += currentNumber;
                currentNumber = 1;
            }
            else if (token === "$") {
                // end of line */
                // console.log("new line"); */
                column = 0;
                row += currentNumber;
                currentNumber = 1;
            }
            else if (token === "!") {
                // end of pattern */
                // console.log("end of pattern") */
            }
        }
        return states;
    };
    Object.defineProperty(RLEParser, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return RLEParser;
}());
var instance = RLEParser.Instance;
exports.default = instance;


/***/ }),

/***/ "./src/settings.ts":
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Holds game state and settings
 */
var Settings = /** @class */ (function () {
    /**
     * Initializes the settings
     * @param canvas Canvas element we use to draw to
     * @param resolution The desired resolution
     */
    function Settings(canvas, resolution) {
        /**
         * Is snap to grid enabled
         */
        this.snapToGrid = true;
        /**
         * Is show grid enabled
         */
        this.showGrid = true;
        /**
         * Display game info box
         * @type {boolean}
         */
        this.showInfo = false;
        /**
         * Fps at witch the game is being drawn/updated
         * @type {number}
         */
        this.fps = 24;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this._width = canvas.width;
        this._height = canvas.height;
        this._resolution = resolution;
    }
    Object.defineProperty(Settings.prototype, "width", {
        /**
         * Returns the canvas width
         * @returns {number} Canvas width
         */
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "height", {
        /**
         * Returns the canvas height
         * @returns {number} Canvas height
         */
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "resolution", {
        /**
         * Returns the current resolution
         * @returns {number} Current resolution
         */
        get: function () {
            return this._resolution;
        },
        /**
         * Sets the resolution to a new value
         * @param {number} value New resolution value
         */
        set: function (value) {
            this._resolution = value;
        },
        enumerable: true,
        configurable: true
    });
    return Settings;
}());
exports.Settings = Settings;
exports.default = Settings;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map