#ifndef NODE_H
#define NODE_H

class Node{
    public:
        Node(int value);
        ~Node();
        int data;
        Node* left;
        Node* right;
        int leftChildNum, rightChildNum;
};

#endif