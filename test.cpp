#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <iostream>

std::string collatz(std::string num) {
    int currentNum;
    int countOnes = 0;
    int total = 0;

    currentNum = stoi(num);

    if (currentNum == 1) {
        return std::to_string(total);
    }

    while (currentNum != 1) {
        total += 1;
        if (currentNum % 2 == 0) {
            currentNum = currentNum / 2;
        } else {
            currentNum = currentNum * 3 + 1;
        }
    }
    return std::to_string(total);
}

[[cheerp::genericjs]] void func() {
    // client::document represent the JavaScript document object

    client::HTMLElement* body = client::document.get_body();
    client::HTMLInputElement* inputBox = static_cast<client::HTMLInputElement*>(
        client::document.createElement("input"));
    inputBox->setAttribute("type", "text");
    inputBox->setAttribute("value", "1");
    body->appendChild(inputBox);

    client::Element* titleElement =
        client::document.getElementById("pagetitle");

    auto mirrorText = [titleElement, inputBox]() -> void {
        client::String* text = inputBox->get_value();
        std::string text2 = text->operator std::string();
        titleElement->set_textContent(collatz(text2).c_str());
    };

    mirrorText();

    inputBox->addEventListener("input", cheerp::Callback(mirrorText));
}

int webMain() {
    func();
    return 0;
}