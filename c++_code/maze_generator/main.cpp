#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <iostream>

#include "maze.h"

std::string mazer(std::string input) {
    Maze maze;

    if (input.empty()) {
        return "Enter a number.";
    }

    maze.readInput(input);
    maze.makeMaze();
    std::string output = maze.outputPath();

    return "\n" + output;
}

[[cheerp::genericjs]] void func() {
    client::HTMLInputElement* inputBox = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("input"));

    client::Element* result = client::document.getElementById("result");

    auto mirrorText = [result, inputBox]() -> void {
        client::String* text = inputBox->get_value();
        std::string text2 = text->operator std::string();

        if (text2.empty()) {
            result->set_textContent("Enter a number.");
        }
        result->set_textContent("Error.");

        result->set_textContent(mazer(text2).c_str());
    };

    mirrorText();

    inputBox->addEventListener("input", cheerp::Callback(mirrorText));
}

[[cheerp::genericjs]] int webMain() {
    func();
    return 0;
}