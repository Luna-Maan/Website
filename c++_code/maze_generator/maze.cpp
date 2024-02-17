#include "maze.h"

#include <iostream>
#include <sstream>
#include <string>

#include "mazemaker.h"
#include "path.h"

void Maze::readInput(std::string input) {
    std::stringstream ss(input);

    ss >> y;

    ss >> x;

    if (!(ss >> seed)) {
        seed = time(0);
    }

    return;
}

void Maze::makeMaze() {
    MazeMaker grid(x, y);

    grid.makeMaze(seed);
    maze = grid.getMaze();
    return;
}

std::string Maze::outputPath() {
    Path path(maze, x, y);

    path.findPath();
    std::string output = path.outputPath();
    return output;
}