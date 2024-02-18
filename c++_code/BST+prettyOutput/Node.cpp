
#include "Node.h"

Node::Node(int value) {
    data = value;
    left = nullptr;
    right = nullptr;

    leftChildNum = 0;
    rightChildNum = 0;
    // std::cout << "constructed node: " << value << std::endl;
}

Node::~Node(){
    delete left;
    delete right;
    // std::cout << "deleted node: " << data << std::endl;
}