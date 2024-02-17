#ifndef PATH_H
#define PATH_H

#include <vector>

class Path {
   public:
    Path(std::vector<std::vector<bool>> maze, int inputX, int inputY);
    void findPath();
    std::string outputPath();

   private:
    int x, y;
    std::vector<std::vector<bool>> wallGrid;
    std::vector<std::vector<bool>> visitedSquares;
    std::vector<std::vector<bool>> pathSquares;
    bool pathGen(int currX, int currY);
};

#endif