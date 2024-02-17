#include <cheerp/client.h>
#include <cheerp/clientlib.h>

#include <cmath>
#include <fstream>
#include <iostream>
#include <sstream>
#include <vector>

#include "mergesort.h"

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

std::string polish(std::string operation) {
    std::stringstream ss(operation);
    std::string temp;
    char op;
    ss >> op;
    double numOne;
    ss >> temp;
    numOne = stod(temp);
    double numTwo;
    ss >> temp;
    numTwo = stod(temp);

    switch (op) {
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

int FindSmallestMissing(std::vector<int> numVector, int smallest) {
    std::vector<int> presentNum(numVector.size() + 1);
    int counter;

    for (int i = 0; i < numVector.size(); i++) {
        if ((numVector.at(i) - smallest) < presentNum.size()) {
            presentNum.at(numVector.at(i) - smallest) = 1;
        }
    }

    counter = smallest;
    for (int i = 0; i < presentNum.size(); i++) {
        if (presentNum.at(i) == 0) {
            return counter;
        }
        counter += 1;
    }
    return counter;
}

std::string Missing(std::string input) {
    std::stringstream ss(input);

    std::vector<int> numVector;
    int temp;
    ss >> temp;
    numVector.push_back(temp);
    int smallest = temp;

    while (ss >> temp) {
        numVector.push_back(temp);

        if (temp < smallest) smallest = temp;
    }

    return std::to_string(FindSmallestMissing(numVector, smallest));
}

double ComputeDiscriminant(double a, double b, double c) {
    double discriminant;

    discriminant = (b * b) - (4 * a * c);

    return discriminant;
}

int DiscriminanttoNumSolutions(double discriminant) {
    int numSolutions;

    if (discriminant > 0) {
        numSolutions = 2;
    } else if (discriminant < 0) {
        numSolutions = 0;
    } else {
        numSolutions = 1;
    }

    return numSolutions;
}

std::vector<double> SolveQuadratic(double a, double b, double discriminant) {
    std::vector<double> solutions(2);

    solutions.at(0) = (-b - sqrt(discriminant)) / (2 * a);
    solutions.at(1) = (-b + sqrt(discriminant)) / (2 * a);

    return solutions;
}

std::string quadratic(std::string input) {
    std::string temp;
    double a, b, c;
    double discriminant;
    int numSolutions;
    std::vector<double> solutions;

    std::stringstream ss(input);
    ss >> temp;
    a = stod(temp);
    ss >> temp;
    b = stod(temp);
    ss >> temp;
    c = stod(temp);

    discriminant = ComputeDiscriminant(a, b, c);
    numSolutions = DiscriminanttoNumSolutions(discriminant);
    solutions = SolveQuadratic(a, b, discriminant);

    std::string output = "";
    switch (numSolutions) {
        case 0:
            output = "There is no solution.\n";
            break;
        case 1:
            output = "There is 1 solution.\n";
            output += "The solution is: " + std::to_string(solutions.at(0));
            break;
        case 2:
            output = "There are 2 solutions.\n";
            output += "The solutions are: " + std::to_string(solutions.at(1)) +
                      " and " + std::to_string(solutions.at(0));
            break;
    }

    return output;
}

std::vector<int> CountAlphaFromInput(std::istream& input) {
    std::string currString;
    std::vector<int> letterCounts(26);

    while (!input.eof()) {
        std::getline(input, currString);
        for (int i = 0; i < currString.length(); i++) {
            if (currString.at(i) >= 'A' && currString.at(i) <= 'Z') {
                letterCounts.at(currString.at(i) - 65) += 1;
            } else if (currString.at(i) >= 'a' && currString.at(i) <= 'z') {
                letterCounts.at(currString.at(i) - 97) += 1;
            }
        }
    }

    return letterCounts;
}

void FindMostCommon(std::vector<int>& letterCounts, char& commonConsonant,
                    int& ConsonantAmount, char& commonVowel, int& VowelAmount) {
    commonVowel = 'a';
    commonConsonant = 'b';

    for (int i = 0; i < letterCounts.size(); i++) {
        if (i == 0 || i == 4 || i == 8 || i == 14 || i == 20) {
            if (letterCounts.at(i) > VowelAmount) {
                VowelAmount = letterCounts.at(i);
                commonVowel = i + 97;
            }
        } else {
            if (letterCounts.at(i) > ConsonantAmount) {
                ConsonantAmount = letterCounts.at(i);
                commonConsonant = i + 97;
            }
        }
    }

    return;
}

std::string OutputMostCommon(char commonConsonant, int consonantAmount,
                             char commonVowel, int vowelAmount) {
    char mostCommon;
    int mostCommonAmount;
    std::string output;

    if (vowelAmount > consonantAmount) {
        mostCommon = commonVowel;
        mostCommonAmount = vowelAmount;
    } else if (vowelAmount < consonantAmount) {
        mostCommon = commonConsonant;
        mostCommonAmount = consonantAmount;
    } else if (commonVowel < commonConsonant) {
        mostCommon = commonVowel;
        mostCommonAmount = vowelAmount;
    } else {
        mostCommon = commonConsonant;
        mostCommonAmount = consonantAmount;
    }

    output = "Most frequent vowel: " + std::string(1, commonVowel) + " (" +
             std::to_string(vowelAmount) + " times)\n";
    output += "Most frequent consonant: " + std::string(1, commonConsonant) +
              " (" + std::to_string(consonantAmount) + " times)\n";
    output += "Most frequent letter, overall: " + std::string(1, mostCommon) +
              " (" + std::to_string(mostCommonAmount) + " times)\n";

    return output;
}

std::string mostCommon(std::string input) {
    std::stringstream inputStream(input);
    std::vector<int> letterCounts(26);
    char commonConsonant, commonVowel;
    int consonantAmount = 0, vowelAmount = 0;

    letterCounts = CountAlphaFromInput(inputStream);

    FindMostCommon(letterCounts, commonConsonant, consonantAmount, commonVowel,
                   vowelAmount);

    std::string output = OutputMostCommon(commonConsonant, consonantAmount,
                                          commonVowel, vowelAmount);

    return output;
}

bool FindKnightsTour(std::vector<std::vector<int> >& board,
                     std::vector<int> beginSquare, std::vector<int> endSquare,
                     int& steps) {
    const int X = 0;
    const int Y = 1;
    bool success;
    std::vector<std::vector<int> > moves{{-2, -1}, {-2, 1}, {2, -1}, {2, 1},
                                         {-1, -2}, {-1, 2}, {1, -2}, {1, 2}};
    std::vector<int> nextSquare{0, 0};

    steps += 1;

    if (beginSquare == endSquare) {
        return true;
    }

    for (int i = 0; i < moves.size(); i++) {
        nextSquare.at(X) = beginSquare.at(X) + moves.at(i).at(X);
        nextSquare.at(Y) = beginSquare.at(Y) + moves.at(i).at(Y);
        if ((nextSquare.at(X) >= 0) && (nextSquare.at(X) < board.size()) &&
            (nextSquare.at(Y) >= 0) && (nextSquare.at(Y) < board.size()) &&
            (board.at(nextSquare.at(X)).at(nextSquare.at(Y)) == 0)) {
            board.at(nextSquare.at(X)).at(nextSquare.at(Y)) = steps;
            success = FindKnightsTour(board, nextSquare, endSquare, steps);

            if (success) {
                return true;
            }
            steps -= 1;
            board.at(nextSquare.at(X)).at(nextSquare.at(Y)) = 0;
        }
    }

    return false;
}

std::string OutputPath(std::vector<std::vector<int> >& board, int steps) {
    std::vector<std::string> movesList(steps);
    char letter;
    std::string number;

    for (int i = 0; i < board.size(); i++) {
        for (int j = 0; j < board.size(); j++) {
            if (board.at(i).at(j) != 0) {
                letter = i + 97;
                if (j >= 9) {
                    number = std::string(1, ((j + 1) / 10) + 48) +
                             std::string(1, ((j + 1) % 10) + 48);
                } else {
                    number = std::string(1, j + 49);
                }
                movesList.at(board.at(i).at(j)) =
                    std::string(1, letter) + number;
            }
        }
    }

    std::string output = "";
    for (int i = 0; i < movesList.size(); i++) {
        output += movesList.at(i) + " ";
    }

    return output;
}

std::string knight(std::string input) {
    const int X = 0;
    const int Y = 1;
    std::stringstream ss(input);

    std::vector<int> beginSquare(2);
    std::vector<int> endSquare(2);

    std::string output = "";
    std::string temp;
    int boardSize;
    char character;
    int value;
    int steps = 1;

    ss >> boardSize;

    ss >> temp;
    std::stringstream beginInput(temp);
    beginInput >> character >> value;
    beginSquare.at(X) = character - 97;
    beginSquare.at(Y) = value - 1;

    ss >> temp;
    std::stringstream endInput(temp);
    endInput >> character >> value;
    endSquare.at(X) = character - 97;
    endSquare.at(Y) = value - 1;

    if (endInput.fail() or beginInput.fail() or ss.fail() or
        boardSize < endSquare.at(X) + 1 or boardSize < endSquare.at(Y) + 1 or
        boardSize < beginSquare.at(X) + 1 or
        boardSize < beginSquare.at(Y) + 1) {
        return "Invalid input.";
    }

    std::vector<int> row(boardSize);
    std::vector<std::vector<int> > board(boardSize, row);

    board.at(beginSquare.at(X)).at(beginSquare.at(Y)) = 1;
    if (FindKnightsTour(board, beginSquare, endSquare, steps)) {
        output = OutputPath(board, steps);
    } else {
        output = "could not find a knight's tour";
    }

    return output;
}

std::string mergeSort(std::string input) {
    std::stringstream ss(input);
    std::string output = "";
    std::vector<double> numbers;

    std::string temp;
    while (ss >> temp) {
        numbers.push_back(stod(temp));
    }

    mergeSort(numbers, 0, numbers.size() - 1);
    for (int i = 0; i < numbers.size(); i++) {
        output += std::to_string(numbers.at(i)) + ' ';
    }

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

    client::HTMLInputElement* inputDedup =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputDedup"));

    client::HTMLInputElement* inputMissing =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputMissing"));

    client::HTMLInputElement* inputQuad =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputQuad"));

    client::HTMLInputElement* inputLetter =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputLetter"));

    client::HTMLInputElement* inputKnight =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputKnight"));

    client::HTMLInputElement* inputSort =
        static_cast<client::HTMLInputElement*>(
            client::document.getElementById("inputSort"));

    client::Element* titleElement =
        client::document.getElementById("pagetitle");

    client::Element* result = client::document.getElementById("result");

    client::Element* resultDedup =
        client::document.getElementById("resultDedup");

    client::Element* resultMissing =
        client::document.getElementById("resultMissing");

    client::Element* resultQuad = client::document.getElementById("resultQuad");

    client::Element* resultLetter =
        client::document.getElementById("resultLetter");

    client::Element* resultKnight =
        client::document.getElementById("resultKnight");

    client::Element* resultSort = client::document.getElementById("resultSort");

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

    auto mirrorText2 = [result, inputBox2]() -> void {
        client::String* input = inputBox2->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            result->set_textContent("Enter an expression.");
        };
        result->set_textContent(polish(text).c_str());
    };

    mirrorText2();

    inputBox2->addEventListener("input", cheerp::Callback(mirrorText2));

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

    auto mirrorTextMissing = [resultMissing, inputMissing]() -> void {
        client::String* input = inputMissing->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultMissing->set_textContent("Enter a list.");
        };
        resultMissing->set_textContent(Missing(text).c_str());
    };

    mirrorTextMissing();

    inputMissing->addEventListener("input",
                                   cheerp::Callback(mirrorTextMissing));

    auto mirrorTextQuad = [resultQuad, inputQuad]() -> void {
        client::String* input = inputQuad->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultQuad->set_textContent("Enter a quadratic equation.");
        };
        resultQuad->set_textContent(quadratic(text).c_str());
    };

    mirrorTextQuad();

    inputQuad->addEventListener("input", cheerp::Callback(mirrorTextQuad));

    auto mirrorTextLetter = [resultLetter, inputLetter]() -> void {
        client::String* input = inputLetter->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultLetter->set_textContent("Enter a string.");
        };
        resultLetter->set_textContent(mostCommon(text).c_str());
    };

    mirrorTextLetter();

    inputLetter->addEventListener("input", cheerp::Callback(mirrorTextLetter));

    auto mirrorTextKnight = [resultKnight, inputKnight]() -> void {
        client::String* input = inputKnight->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultKnight->set_textContent(
                "Enter a board size and two squares.");
        };
        resultKnight->set_textContent(knight(text).c_str());
    };

    mirrorTextKnight();

    inputKnight->addEventListener("input", cheerp::Callback(mirrorTextKnight));

    auto mirrorTextSort = [resultSort, inputSort]() -> void {
        client::String* input = inputSort->get_value();
        std::string text = input->operator std::string();
        if (text.empty()) {
            resultSort->set_textContent("Enter a list.");
        };
        resultSort->set_textContent(mergeSort(text).c_str());
    };

    mirrorTextSort();

    inputSort->addEventListener("input", cheerp::Callback(mirrorTextSort));
}

int webMain() {
    func();
    return 0;
}