#include "path.h"

#include <iostream>

Path::Path(std::vector<std::vector<bool>> maze, int inputX, int inputY) {
    x = inputX;
    y = inputY;
    wallGrid = maze;
    std::vector<bool> row(x, 0);
    pathSquares = std::vector<std::vector<bool>>(y, row);
    visitedSquares = std::vector<std::vector<bool>>(y, row);

    return;
}

void Path::findPath() {
    int currX = 0;
    int currY = 0;
    pathGen(currX, currY);
    pathSquares.at(y - 1).at(x - 1) = 1;

    return;
}

std::string Path::outputPath() {
    std::string output = "";
    std::string line1 = "";
    std::string line2 = "";
    std::string line3 = "";
    std::string line4 = "";

    for (int j = 0; j < pathSquares.size(); j++) {
        for (int i = 0; i < pathSquares.at(j).size(); i++) {
            line1 += (wallGrid.at(2 * j).at(i) == 1) ? "+---" : "+   ";

            if (pathSquares.at(j).at(i) == 1) {
                line2 += (wallGrid.at(2 * j + 1).at(i) == 1) ? "| . " : "  . ";
            } else {
                line2 += (wallGrid.at(2 * j + 1).at(i) == 1) ? "|   " : "    ";
            }
        }
        line1 += "+\n";
        line2 += "|\n";
        output += line1 + line2;

        line1 = "";
        line2 = "";
        line3 = "";
        line4 = "";
    }

    for (int i = 0; i < x; i++) {
        line1 += "+---";
    }
    output += line1 + "+\n";

    return output;
}

bool Path::pathGen(int currX, int currY) {
    int tempX;
    int tempY;
    std::vector<std::vector<int>> validMoves;
    std::vector<int> randomMove(2);
    visitedSquares.at(currY).at(currX) = 1;

    while (true) {
        if (currX + 1 == x && currY + 1 == y) {
            return true;
        }

        if (currY - 1 >= 0 && visitedSquares.at(currY - 1).at(currX) == 0 &&
            wallGrid.at(2 * currY).at(currX) == 0) {
            validMoves.push_back({-1, 0});
        }
        if (currX + 1 < x && visitedSquares.at(currY).at(currX + 1) == 0 &&
            wallGrid.at(2 * currY + 1).at(currX + 1) == 0) {
            validMoves.push_back({0, 1});
        }
        if (currY + 1 < y && visitedSquares.at(currY + 1).at(currX) == 0 &&
            wallGrid.at(2 * currY + 2).at(currX) == 0) {
            validMoves.push_back({1, 0});
        }
        if (currX - 1 >= 0 && visitedSquares.at(currY).at(currX - 1) == 0 &&
            wallGrid.at(2 * currY + 1).at(currX) == 0) {
            validMoves.push_back({0, -1});
        }

        if (validMoves.size() == 0) {
            return false;
        }

        randomMove = validMoves.at(rand() % validMoves.size());

        pathSquares.at(currY).at(currX) = 1;
        if (pathGen(currX + randomMove.at(1), currY + randomMove.at(0))) {
            return true;
        }
        pathSquares.at(currY).at(currX) = 0;

        validMoves.clear();
    }
}