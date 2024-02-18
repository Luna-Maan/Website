#ifndef BST_H
#define BST_H

#include <string>
#include <vector>

#include "Node.h"
class BST {
   public:
    BST();
    ~BST();
    void insertKey(int newKey);
    bool hasKey(int searchKey);
    std::vector<int> inOrder();
    int getHeight();
    std::string prettyPrint();

   private:
    Node* root;
    std::vector<int> inOrderHelper(Node* currNode);
    int getHeightHelper(Node* currNode);
    std::vector<std::string> prettyPrintHelper(Node* currNode, int depth,
                                               int max);
};

#endif