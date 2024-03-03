answer = 0;
questionNum = 0;
correct = 0;
incorrect = 0;

function loadHandler() {
    let question = document.getElementById("question");
    let max = document.getElementById("max").value;

    let een = Math.floor(Math.random() * max);
    let twee = Math.floor(Math.random() * max);

    question.innerHTML = "Q" + questionNum + ": " + een + " + " + twee + " = ";
    questionNum++;
    answer = een + twee;
}

window.addEventListener("load", loadHandler);

function checkAnswer() {
    let input = document.getElementById("answer");
    let result = document.getElementById("result");
    let stats = document.getElementById("stats");

    if (input.value == answer) {
        correct++;
        result.innerHTML = "Correct!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
        loadHandler();
    } else {
        incorrect++;
        result.innerHTML = "Incorrect!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
    }

    input.value = "";
}

let inputBox = document.getElementById("answer");
inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});