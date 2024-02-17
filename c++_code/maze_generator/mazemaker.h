#ifndef MAZEMAKER_H
#define MAZEMAKER_H

#include <vector>

class MazeMaker {
    public:
        MazeMaker(int x, int y);
        void makeMaze(int seed);
        std::vector<std::vector<bool>> getMaze();

    private:
        std::vector<std::vector<bool>> wallGrid;
        std::vector<std::vector<bool>> usedSquares;
        int x, y, numSteps;
        void mazeGen(int currX, int currY);
};


#endif