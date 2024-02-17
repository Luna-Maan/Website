#include <iostream>
#include <cstdlib>

#include "mazemaker.h"

MazeMaker::MazeMaker(int inputX, int inputY) {
    numSteps = 0;
    x = inputX;
    y = inputY;
    std::vector<bool> wallRow(x, 1);
    wallGrid = std::vector<std::vector<bool>>(2*y, wallRow);
    std::vector<bool> usedRow(x, 0);
    usedSquares = std::vector<std::vector<bool>> (y, usedRow);

    return;
}

void MazeMaker::makeMaze(int seed) {
    srand(seed);
    int currX = 0;
    int currY = 0;
    mazeGen(currX, currY );

    return;
}

std::vector<std::vector<bool>> MazeMaker::getMaze() {
    return wallGrid;
}

void MazeMaker::mazeGen(int currX, int currY){
    int tempX;
    int tempY;
    std::vector<std::vector<int>> validMoves;
    std::vector<int> randomMove(2);
    usedSquares.at(currY).at(currX) = 1;

    while(true) {
        if (numSteps == x*y) {
            return;
        }

        if (currY - 1 >= 0 && usedSquares.at(currY - 1).at(currX)==0) {
            validMoves.push_back({-1,0});
        }
        if (currX + 1 < x && usedSquares.at(currY).at(currX + 1)==0) {
            validMoves.push_back({0,1});
        }
        if (currY + 1 < y && usedSquares.at(currY + 1).at(currX)==0) {
            validMoves.push_back({1,0});
        }
        if (currX - 1 >= 0 && usedSquares.at(currY).at(currX - 1)==0) {
            validMoves.push_back({0,-1});
        }

        if (validMoves.size()==0) {
            return;
        }

        randomMove = validMoves.at(rand() % validMoves.size());

        if (randomMove.at(1) == -1) {
            tempX = 0;
            tempY = 0;
        } else {
            tempX = randomMove.at(1);
            tempY = randomMove.at(0);
        }

        wallGrid.at(currY*2 + 1 + tempY).at(currX + tempX) = 0;

        mazeGen(currX + randomMove.at(1), currY + randomMove.at(0));

        validMoves.clear();
    }
}