#include "BST.h"

#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <cmath>
#include <iomanip>
#include <iostream>
#include <queue>
#include <sstream>
#include <string>
#include <vector>

#include "Node.h"

BST::BST() {
    root = nullptr;
    // std::cout << "constructed BST\n";
}

BST::~BST() {
    delete root;
    // std::cout << "deleted root\n";
}

void BST::insertKey(int newKey) {
    Node* currNode = root;

    if (root == nullptr) {
        root = new Node(newKey);
        return;
    }

    while (true) {
        if (newKey < currNode->data) {
            currNode->leftChildNum += 1;
            if (currNode->left == nullptr) {
                currNode->left = new Node(newKey);
                return;
            } else {
                currNode = currNode->left;
            }
        } else {
            currNode->rightChildNum += 1;
            if (currNode->right == nullptr) {
                currNode->right = new Node(newKey);
                return;
            } else {
                currNode = currNode->right;
            }
        }
    }

    return;
}

bool BST::hasKey(int searchKey) {
    Node* currNode = root;

    if (root == nullptr) {
        return false;
    }

    while (true) {
        if (currNode->data == searchKey) {
            return true;
        } else {
            if (searchKey < currNode->data) {
                currNode = currNode->left;
            } else {
                currNode = currNode->right;
            }
        }

        if (currNode == nullptr) {
            return false;
        }
    }
}

std::vector<int> BST::inOrder() {
    if (root != nullptr) {
        return inOrderHelper(root);
    }

    return std::vector<int>();
}

int BST::getHeight() {
    int height = 0;

    if (root != nullptr) {
        height = getHeightHelper(root);
    }

    return height;
}

std::string BST::prettyPrint() {
    std::vector<std::string> table(getHeight() * 2 + 1);
    std::vector<std::string> result(getHeight() * 2 + 1);
    int numElements;
    std::string cell = "    |";
    int total;

    if (root == nullptr) {
        return "";
    } else {
        numElements = root->leftChildNum + root->rightChildNum + 1;
    }

    Node* temp = root;
    while (temp->right != nullptr) {
        temp = temp->right;
    }
    int max = temp->data == 0 ? 1 : std::log10(temp->data) + 1;

    std::string line(max + 1, '-');

    for (int i = 0; i < table.size(); i++) {
        if (i % 2 == 0) {
            table.at(i) = "-";
            for (int j = 0; j < numElements; j++) {
                table.at(i) += line;
            }
        } else {
            table.at(i) = "|";
        }
    }

    result = BST::prettyPrintHelper(root, 0, max);

    std::string output = "The tree in the form of a table:\n";
    for (int i = 0; i < table.size(); i++) {
        table.at(i) += result.at(i);
        output += table.at(i);
        output += '\n';
    }

    return output;
}

std::vector<int> BST::inOrderHelper(Node* currNode) {
    std::vector<int> result;

    if (currNode->left != nullptr) {
        std::vector<int> templeft = inOrderHelper(currNode->left);  // gives us the left subtree in order in a list

        for (int i = 0; i < templeft.size(); i++) {                 // loop over the list and add the elements to the result
            result.push_back(templeft.at(i));
        }
    }

    result.push_back(currNode->data);                                // add the current node to the result	

    if (currNode->right != nullptr) {
        std::vector<int> tempright = inOrderHelper(currNode->right); // gives us the right subtree in order in a list

        for (int i = 0; i < tempright.size(); i++) {                 // loop over the list and add the elements to the result
            result.push_back(tempright.at(i));
        }
    }

    return result;
}

int BST::getHeightHelper(Node* currNode) {
    int heightLeft = 0;
    int heightRight = 0;
    int height;

    if (currNode->left != nullptr) {
        heightLeft = getHeightHelper(currNode->left);
    }

    if (currNode->right != nullptr) {
        heightRight = getHeightHelper(currNode->right);
    }

    height = (heightLeft > heightRight) ? heightLeft : heightRight;
    return height + 1;
}

std::vector<std::string> BST::prettyPrintHelper(Node* currNode, int depth,
                                                int max) {
    std::vector<std::string> table(getHeight() * 2 + 1);
    std::vector<std::string> result(getHeight() * 2 + 1);
    std::string data;

    if (currNode->left != nullptr) {
        result = prettyPrintHelper(currNode->left, depth + 1, max);

        for (int i = 0; i < table.size(); i++) {
            table.at(i) += result.at(i);
        }
    }

    for (int i = 0; i < getHeight(); i++) {
        if (i == depth) {
            data = std::to_string(currNode->data);

            while (data.length() < max) {
                data = " " + data;
            }

            table.at(i * 2 + 1) += data + "|";
        } else {
            table.at(i * 2 + 1) += std::string(max, ' ') + "|";
        }
    }

    if (currNode->right != nullptr) {
        result = prettyPrintHelper(currNode->right, depth + 1, max);

        for (int i = 0; i < table.size(); i++) {
            table.at(i) += result.at(i);
        }
    }

    return table;
}