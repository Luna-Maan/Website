#ifndef MAZE_H
#define MAZE_H

#include <vector>

#include "mazemaker.h"
#include "path.h"

class Maze {
   public:
    void readInput(std::string input);
    void makeMaze();
    std::string outputPath();

   private:
    int x, y, seed;
    std::vector<std::vector<bool>> maze;
};

#endif