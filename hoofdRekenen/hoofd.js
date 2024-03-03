answer = 0;
questionNum = 0;
correct = 0;
incorrect = 0;
startTime = 0;

function loadHandler() {
    let question = document.getElementById("question");

    let add = document.getElementById("add").checked;
    let subtract = document.getElementById("sub").checked;
    let multiply = document.getElementById("mul").checked;
    let divide = document.getElementById("div").checked;

    let numOperators = 0;
    let operators = [];
    if (add) {
        numOperators += 1;
        operators.push("add");
    }
    if (subtract) {
        numOperators += 1;
        operators.push("subtract");
    }
    if (multiply) {
        numOperators += 1;
        operators.push("multiply");
    }
    if (divide) {
        numOperators += 1;
        operators.push("divide");
    }

    if (numOperators == 0) {
        alert("Please select at least one operator");
        return;
    }

    question.innerHTML = "Q" + (questionNum + 1) + ": ";
    let operator = Math.floor(Math.random() * numOperators);
    if (operators[operator] === "add") {
        addQuestion();
    }
    if (operators[operator] === "subtract") {
        subtractQuestion();
    }
    if (operators[operator] === "multiply") {
        multiplyQuestion();
    }
    if (operators[operator] === "divide") {
        divideQuestion();
    }

    questionNum++;
}

function addQuestion() {
    let max = parseInt(document.getElementById("max").value) + 1;
    let question = document.getElementById("question");

    let een = Math.floor(Math.random() * max);
    let twee = Math.floor(Math.random() * max);

    question.innerHTML += een + " + " + twee;
    answer = een + twee;
}

function subtractQuestion() {
    let max = parseInt(document.getElementById("max").value) + 1;
    let question = document.getElementById("question");

    let een = Math.floor(Math.random() * max);
    let twee = Math.floor(Math.random() * max);

    question.innerHTML += een + " - " + twee;
    answer = een - twee;
}

function multiplyQuestion() {
    let max = document.getElementById("max").value;
    let question = document.getElementById("question");

    max = Math.ceil(max ** 0.5);

    let een = Math.floor(Math.random() * max);
    let twee = Math.floor(Math.random() * max);

    question.innerHTML += een + " * " + twee;
    answer = een * twee;
}
function divideQuestion() {
    let max = document.getElementById("max").value;
    let question = document.getElementById("question");

    max = Math.ceil(max ** 0.5);

    let een = Math.floor(Math.random() * max);
    let twee = Math.ceil(Math.random() * max + 1);

    een = een * twee;

    question.innerHTML += een + " / " + twee;
    answer = een / twee;
}

window.addEventListener("load", loadHandler);

function checkAnswer() {
    if (questionNum == 1) {
        startTime = new Date();
    }

    let input = document.getElementById("answer");
    let result = document.getElementById("result");
    let stats = document.getElementById("stats");
    let maxQuestions = document.getElementById("numQuestions").value;

    if (input.value == answer) {
        correct++;
        result.innerHTML = "Correct!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
        if (correct == maxQuestions) {
            alert("You have completed the quiz!\nYou got " + correct + " out of " + (incorrect + correct) + " correct!\nIt took you " + (new Date() - startTime) / 1000 + " seconds!");
            correct = 0;
            incorrect = 0;
            questionNum = 0;
        }
        loadHandler();
    } else {
        incorrect++;
        result.innerHTML = "Incorrect!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
        if (correct == maxQuestions) {
            alert("You have completed the quiz!\nYou got " + correct + " out of " + (incorrect + correct) + " correct!\nIt took you " + (new Date() - startTime) / 1000 + " seconds!");
            correct = 0;
            questionNum = 0;
            incorrect = 0;
        }
        loadHandler();
    }

    input.value = "";
}

let inputBox = document.getElementById("answer");
inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});