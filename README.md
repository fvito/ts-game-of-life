# ts-game-of-life
A simple and basic Game of Life implementation in TypeScript language. Developed as part of a school assignment.
The editor supports manual marking of live/dead cells as well as importing and placing existing patterns encoded in RLE format (eg. from [game of life wiki](http://www.conwaylife.com/wiki/Category:Patterns)). Some patterns are also included and pre populated.


The editor also supports some basic settings:
* Setting the canvas resolution
* Settings the draw speed/fps
* Minor graphical settings (draw grid, draw info box, snap to grid)

On top of the grid there are control buttons for:
* Stepping through the algorithm
* Running the game of life
* Randomly generating cells
* Clearing the board

Some basic unit tests are also included using _mocha_ and _chai_ libraries
