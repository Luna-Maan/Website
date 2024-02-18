#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <iomanip>
#include <iostream>
#include <sstream>
#include <vector>

#include "BST.h"

BST tree;

std::string printInOrder(BST& tree) {
    std::string output = "";

    std::vector<int> inOrder = tree.inOrder();
    output = "The numbers in sorted order: ";
    for (int i = 0; i < inOrder.size(); i++) {
        output += std::to_string(inOrder.at(i)) + ' ';
    }

    return output;
}

void insertNumbers(BST& tree, std::string inp) {
    int value;
    std::string input;
    std::stringstream ss(inp);

    while (ss >> value) {
        tree.insertKey(value);
    }
}

std::string treem(std::string input) {
    std::string output = "";

    std::stringstream ss(input);
    std::string temp;
    char cmd;

    ss >> temp;
    cmd = temp[0];

    std::string inp = "";
    while (ss >> temp) {
        inp += temp + ' ';
    }

    switch (cmd) {
        case 'i':
            insertNumbers(tree, inp);
            output = "The numbers have been inserted.";
            break;
        case 'o':
            output = printInOrder(tree);
            break;
        case 'p':
            output = tree.prettyPrint();
            break;
        default:
            output = "Invalid command.";
            break;
    }

    return output;
}

[[cheerp::genericjs]] void treeMain() {
    client::HTMLInputElement* inputBox = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("input"));

    client::HTMLInputElement* button = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("button"));

    client::HTMLInputElement* output = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("output"));

    client::HTMLInputElement* print = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("print"));

    client::Element* result = client::document.getElementById("result");

    auto mirrorText = [result, inputBox]() -> void {
        client::String* text = inputBox->get_value();
        std::string text2 = text->operator std::string();
        int temp;
        char cmd;

        if (text2.empty()) {
            result->set_textContent("Enter a number.");
        } else {
            result->set_textContent(treem("i " + text2).c_str());
        }
    };
    mirrorText();

    button->addEventListener("click", cheerp::Callback(mirrorText));

    auto mirrorOutput = [result, inputBox]() -> void {
        result->set_textContent(treem("o").c_str());
    };
    mirrorOutput();

    output->addEventListener("click", cheerp::Callback(mirrorOutput));

    auto mirrorPrint = [result, inputBox]() -> void {
        result->set_textContent(treem("p").c_str());
    };
    mirrorPrint();

    print->addEventListener("click", cheerp::Callback(mirrorPrint));
}

[[cheerp::genericjs]] int webMain() {
    treeMain();
    return 0;
}