#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <iostream>
#include <sstream>
#include <vector>

std::string collatz(std::string num) {
    unsigned long long currentNum;
    int countOnes = 0;
    int total = 0;

    std::string steps = "";
    currentNum = stoll(num);

    if (currentNum == 1) {
        return std::to_string(total);
    }

    while (currentNum > 1) {
        total += 1;
        steps += std::to_string(currentNum) + " ";
        if (currentNum % 2 == 0) {
            currentNum = currentNum / 2;
        } else {
            if (currentNum > 6148914691236517204) {
                return "Overflow Error: A number in the steps is too "
                       "large. (18446744073709551615 is the largest number "
                       "allowed.)";
            }
            currentNum = currentNum * 3 + 1;
        }
    }
    return std::to_string(total) + ";\n " + steps + std::to_string(currentNum);
}

std::string polish(std::string operation, std::string One, std::string Two) {
    double numOne = stod(One);
    double numTwo = stod(Two);
    const char* op = operation.c_str();

    switch (op[0]) {
        case '+':
            return std::to_string(numOne) + " + " + std::to_string(numTwo) +
                   " = " + std::to_string(numOne + numTwo);
        case '-':
            return std::to_string(numOne) + " - " + std::to_string(numTwo) +
                   " = " + std::to_string(numOne - numTwo);
        case '/':
            return std::to_string(numOne) + " / " + std::to_string(numTwo) +
                   " = " + std::to_string(numOne / numTwo);
        case '*':
            return std::to_string(numOne) + " * " + std::to_string(numTwo) +
                   " = " + std::to_string(numOne * numTwo);
        default:
            return "Invalid operation.";
    }
}

void Deduplicate(std::vector<int>& userVector) {
    std::vector<int> newVector;
    bool inNewVector;

    for (int i = 0; i < userVector.size(); i++) {
        inNewVector = false;

        for (int j = 0; j < newVector.size(); j++) {
            if (newVector.at(j) == userVector.at(i)) {
                inNewVector = true;
                break;
            }
        }

        if (!inNewVector) {
            newVector.push_back(userVector.at(i));
        }
    }

    userVector = newVector;

    return;
}

std::string dedup(std::string input) {
    std::vector<int> userVector;
    int tempVal;

    std::istringstream iss(input);
    std::string word;
    while (iss >> word) {
        userVector.push_back(stoi(word));
    }

    Deduplicate(userVector);

    std::string output = "[";
    output += std::to_string(userVector.at(0));
    for (int i = 1; i < userVector.size(); i++) {
        output += ',' + std::to_string(userVector.at(i));
    }
    output += "]";

    return output;
}

[[cheerp::genericjs]] void func() {
    // client::document represent the JavaScript document object

    client::HTMLElement* body = client::document.get_body();
    client::HTMLInputElement* inputBox = static_cast<client::HTMLInputElement*>(
        client::document.getElementById("input"));

    client::HTMLInputElement* inputBox2 =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("input2"));

    client::HTMLInputElement* inputBox3 =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("input3"));

    client::HTMLInputElement* inputBox4 =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("input4"));

    client::HTMLInputElement* inputDedup =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputDedup"));

    client::Element* titleElement =
        client::document.getElementById("pagetitle");

    client::Element* result = client::document.getElementById("result");

    client::Element* resultDedup =
        client::document.getElementById("resultDedup");

    auto mirrorText = [titleElement, inputBox]() -> void {
        client::String* text = inputBox->get_value();
        std::string text2 = text->operator std::string();
        if (text2.empty()) {
            titleElement->set_textContent("Enter a number.");
        } else {
            titleElement->set_textContent(
                "Overflow error: Input too large. (18446744073709551615 is the "
                "largest number "
                "allowed.)");
        }

        titleElement->set_textContent(collatz(text2).c_str());
    };

    mirrorText();

    inputBox->addEventListener("input", cheerp::Callback(mirrorText));

    auto mirrorText2 = [result, inputBox2, inputBox3, inputBox4]() -> void {
        client::String* input = inputBox2->get_value();
        client::String* input2 = inputBox3->get_value();
        client::String* input3 = inputBox4->get_value();
        std::string text = input->operator std::string();
        std::string text2 = input2->operator std::string();
        std::string text3 = input3->operator std::string();
        if (text.empty() || text2.empty() || text3.empty()) {
            result->set_textContent("Enter an expression.");
        };
        result->set_textContent(polish(text, text2, text3).c_str());
    };

    mirrorText2();

    inputBox2->addEventListener("input", cheerp::Callback(mirrorText2));
    inputBox3->addEventListener("input", cheerp::Callback(mirrorText2));
    inputBox4->addEventListener("input", cheerp::Callback(mirrorText2));

    auto mirrorTextDedup = [resultDedup, inputDedup]() -> void {
        client::String* input = inputDedup->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultDedup->set_textContent("Enter a list.");
        };
        resultDedup->set_textContent(dedup(text).c_str());
    };

    mirrorTextDedup();

    inputDedup->addEventListener("input", cheerp::Callback(mirrorTextDedup));
}

int webMain() {
    func();
    return 0;
}