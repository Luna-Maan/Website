answer = 0;
questionNum = 0;
correct = 0;
incorrect = 0;
startTime = 0;
vraag = "";
numOperators = 0;
operators = [];
amountMode = true;
timerSet = false;
timer = 0;
usedTime = 0;

function loadHandler() {
    let add = document.getElementById("add").checked;
    let subtract = document.getElementById("sub").checked;
    let multiply = document.getElementById("mul").checked;
    let divide = document.getElementById("div").checked;

    let exponent = document.getElementById("exp").checked;
    let root = document.getElementById("root").checked;
    let modulo = document.getElementById("mod").checked;

    let knuth = document.getElementById("knuth").checked;
    let priemn = document.getElementById("priemn").checked;

    let result = document.getElementById("result");
    let stats = document.getElementById("stats");

    maxQuestions = document.getElementById("numQuestions").value;

    if (timerSet) {
        clearTimeout(timer);
        timerSet = false;
    }

    if (amountMode) {
        maxQuestions = parseInt(maxQuestions);
        if (maxQuestions == 0) {
            maxQuestions = -1;
        }
    }
    else {
        maxQuestions = -1;
    }

    result.innerHTML = "";
    stats.innerHTML = "";

    correct = 0;
    incorrect = 0;
    questionNum = 0;

    operators = [];
    numOperators = 0;
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

    if (exponent) {
        numOperators += 1;
        operators.push("exponent");
    }
    if (root) {
        numOperators += 1;
        operators.push("root");
    }
    if (modulo) {
        numOperators += 1;
        operators.push("modulo");
    }

    if (knuth) {
        numOperators += 1;
        operators.push("knuth");
    }
    if (priemn) {
        numOperators += 1;
        operators.push("priemn");
    }

    if (numOperators == 0) {
        alert("Please select at least one operator");
        return;
    }

    nextQuestion();
}

function nextQuestion() {
    console.log("nextQuestion")
    let question = document.getElementById("question");

    vraag = "<div class=\"tooltip\">Q" + (questionNum + 1);
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
    if (operators[operator] === "exponent") {
        exponentQuestion();
    }
    if (operators[operator] === "root") {
        rootQuestion();
    }
    if (operators[operator] === "modulo") {
        moduloQuestion();
    }
    if (operators[operator] === "knuth") {
        knuthQuestion();
    }
    if (operators[operator] === "priemn") {
        priemnQuestion();
    }

    question.innerHTML = vraag;
    MathJax.typeset();
    questionNum++;
}

function addQuestion() {
    let max = parseInt(document.getElementById("max").value) + 1;
    let negatives = document.getElementById("negatives").checked;

    if (negatives) {
        een = Math.floor(Math.random() * max * 2) - max;
        twee = Math.floor(Math.random() * max * 2) - max;
    }
    else {
        een = Math.floor(Math.random() * max);
        twee = Math.floor(Math.random() * max);
    }

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Addition\">wikipedia: addition</a></span></div>: ";
    vraag += "\\(" + een + " + " + twee + "=\\)";
    answer = een + twee;
}

function subtractQuestion() {
    let max = parseInt(document.getElementById("max").value) + 1;
    let negatives = document.getElementById("negatives").checked;

    if (negatives) {
        een = Math.floor(Math.random() * max * 2) - max;
        twee = Math.floor(Math.random() * max * 2) - max;
    }
    else {
        een = Math.floor(Math.random() * max);
        twee = Math.floor(Math.random() * max);
    }

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Subtraction\">wikipedia: subtraction</a></span></div>";
    vraag += ": \\(" + een + " - " + twee + "=\\)";
    answer = een - twee;
}

function multiplyQuestion() {
    let max = document.getElementById("max").value;
    let negatives = document.getElementById("negatives").checked;

    max = Math.ceil(max ** 0.5);

    if (negatives) {
        een = Math.floor(Math.random() * max * 2) - max;
        twee = Math.floor(Math.random() * max * 2) - max;
    }
    else {
        een = Math.floor(Math.random() * max);
        twee = Math.floor(Math.random() * max);
    }

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://wikikids.nl/Vermenigvuldigen\">Wikikids: vermenigvuldig</a></span></div>: "
    vraag += "\\(" + een + " \\cdot " + twee + "=\\)";
    answer = een * twee;
}

function divideQuestion() {
    let max = document.getElementById("max").value;
    let negatives = document.getElementById("negatives").checked;

    max = Math.ceil(max ** 0.5);

    if (negatives) {
        een = Math.floor(Math.random() * max * 2) - max;
        twee = Math.floor(Math.random() * max * 2) - max;
        if (twee == 0) {
            twee = max + 1;
        }
    }
    else {
        een = Math.floor(Math.random() * max);
        twee = Math.floor(Math.random() * max + 1);
    }

    een = een * twee;

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Division_(mathematics)\">wikipedia: division</a></span></div>";
    vraag += ": \\(\\dfrac{" + een + "}{" + twee + "}=\\)";
    answer = een / twee;
}

function exponentQuestion() {
    let max = document.getElementById("max").value;
    let negatives = document.getElementById("negatives").checked;


    if (negatives) {
        twee = Math.floor(Math.random() * (Math.log(max) - 2)) + 2;
        een = Math.floor(Math.random() * (max ** (1 / twee)) * 2) - Math.floor((max ** (1 / twee)));
    }
    else {
        twee = Math.floor(Math.random() * (Math.log(max) - 2)) + 2;
        een = Math.floor(Math.random() * (max ** (1 / twee)));
    }

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Exponentiation\">wikipedia: Exponentiation</a></span></div>";
    if (een < 0) {
        vraag += ": \\((" + een + ")^{" + twee + "}=\\)";
    }
    else {
        vraag += ": \\(" + een + "^{" + twee + "}=\\)";
    }
    answer = een ** twee;
}

function moduloQuestion() {
    let max = document.getElementById("max").value;
    let negatives = document.getElementById("negatives").checked;

    if (negatives) {
        een = Math.floor(Math.random() * max * 2) - max;
        max = Math.ceil(max ** 0.5);
        twee = Math.floor(Math.random() * max);
        if (twee == 0) {
            twee = max + 1;
        }
    }
    else {
        een = Math.floor(Math.random() * max);
        max = Math.ceil(max ** 0.5);
        twee = Math.floor(Math.random() * max);
        if (twee == 0) {
            twee = max + 1;
        }
    }

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Modulo\">wikipedia: modulo</a></span></div>";
    vraag += ": \\(" + een + "\\ mod\\ " + twee + "=\\)";
    answer = een % twee;
}

function rootQuestion() {
    let max = document.getElementById("max").value;

    max = Math.ceil(max ** 0.5);

    een = Math.floor(Math.random() * max);
    een = een * een;

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Square_root\">wikipedia: square root</a></span></div>";
    vraag += ": \\(\\sqrt{" + een + "}=\\)";
    answer = een ** 0.5;
}

function knuthQuestion() {
    let max = document.getElementById("max").value;

    maxnum = 0;
    while (maxnum ** maxnum < max) {
        maxnum++;
    }

    een = Math.floor(Math.random() * (maxnum - 1)) + 1;

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Knuth%27s_up-arrow_notation\">wikipedia: Knuth's up-arrow notation</a></span></div>: ";

    if (een == 1) {
        twee = Math.floor(Math.random() * max);
        answer = 1;
    }
    else if (een == 2) {
        if (max > 65536) {
            twee = Math.ceil(Math.random() * 3) + 1
        }
        else if (max > 16) {
            twee = Math.ceil(Math.random() * 2) + 1
        }
        else if (max > 4) {
            twee = Math.ceil(Math.random() * 1) + 1;
        }
        else {
            twee = 1;
        }
        if (twee == 1) {
            answer = 2;
        }
        if (twee == 2) {
            answer = 2 ** 2;
        }
        if (twee == 3) {
            answer = 2 ** (2 ** 2);
        }
        if (twee == 4) {
            answer = 2 ** (2 ** (2 ** 2));
        }
    }
    else {
        twee = Math.floor(Math.random() * 2) + 1;
        if (twee == 1) {
            answer = een;
        }
        if (twee == 2) {
            answer = een ** een;
        }
    }
    vraag += "\\(" + een + "\\uparrow \\uparrow" + twee + "=\\)";
}

function priemnQuestion() {
    let max = document.getElementById("max").value;

    een = Math.floor(Math.random() * (max ** (1 / 3))) + 1;

    priemNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271];

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Prime_number\">wikipedia: prime number.</a> P<sub>n</sub> is the n'th prime number. P<sub>1</sub>=2</span></div>: ";
    vraag += "\\(P_{" + een + "}=\\)";
    answer = priemNumbers[een - 1];
}

window.addEventListener("load", loadHandler);
start = document.getElementById("start");
start.addEventListener("click", loadHandler);

async function checkAnswer() {
    if (questionNum == 1) {
        startTime = new Date();
    }

    if (amountMode == false && timerSet == false) {
        time = document.getElementById("timeLimit").value;
        timer = setTimeout(timeEndQuiz, time * 1000);
        timerSet = true;
    }

    let input = document.getElementById("answer");
    let result = document.getElementById("result");
    let stats = document.getElementById("stats");

    if (input.value == answer) {
        input.value = "";
        correct++;
        result.innerHTML = "Correct!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
        if (correct == maxQuestions) {
            modal = document.getElementById("modal");
            title = document.getElementById("modal-title");
            content = document.getElementById("modal-content");

            title.innerHTML = "Quiz complete!";
            usedTime = new Date() - startTime;
            content.innerHTML = "You have completed the quiz! <br> You got " + correct + " out of " + (incorrect + correct) + " correct! <br> It took you " + (usedTime) / 1000 + " seconds!";

            modal.style.display = "block";

            showLeaderboard();

            loadHandler();
            return;
        }
        nextQuestion();
    } else {
        input.value = "";
        incorrect++;
        result.innerHTML = "Incorrect!";
        stats.innerHTML = "Correct: " + correct + "/" + (incorrect + correct);
        nextQuestion();
    }
}

function timeEndQuiz() {
    modal = document.getElementById("modal");
    title = document.getElementById("modal-title");
    content = document.getElementById("modal-content");

    title.innerHTML = "Time is up!";
    content.innerHTML = "You have completed the quiz! <br> You got " + correct + " out of " + (incorrect + correct) + " correct! <br> It took you " + (new Date() - startTime) / 1000 + " seconds!";

    modal.style.display = "block";

    showLeaderboard();

    loadHandler();
}

let inputBox = document.getElementById("answer");
inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

mode1 = document.getElementById("amountMode");
mode1.addEventListener("change", function () {
    console.log("amountMode");
    document.getElementById("amountInput").style.display = "table-row";
    document.getElementById("timeInput").style.display = "none";
    amountMode = true;
});

mode2 = document.getElementById("timedMode");
mode2.addEventListener("change", function () {
    console.log("timedMode");
    document.getElementById("amountInput").style.display = "none";
    document.getElementById("timeInput").style.display = "table-row";
    amountMode = false;
});


window.addEventListener("click", windowHandler);
async function windowHandler(event) {
    let modal = document.getElementById("modal");
    let isClickInside = modal.contains(event.target);

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

closeModal = document.getElementById("close");
closeModal.addEventListener("click", function () {
    modal = document.getElementById("modal");
    modal.style.display = "none";
});

async function showLeaderboard() {
    let leaderboard = document.getElementById("leaderboard");
    let title = document.getElementById("leaderboard-title");

    standardOps = ["add", "subtract", "multiply", "divide"];

    let response = await fetch("https://tutorial-worker.pvanoostveenneo2.workers.dev/leaderboard/default");
    let text = await response.text();
    text = JSON.parse(text);
    console.log(text);
    if (check(operators, standardOps) && amountMode && maxQuestions == 10 && document.getElementById("max").value == 100 && !document.getElementById("negatives").checked) {
        leaderboard.style.display = "table";
        title.innerHTML = "Leaderboard for this category:";
        leaderboard.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

        for (let i = 0; i < text.length; i++) {
            leaderboard.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + text[i].name + "</td><td>" + text[i].score + "</td></tr>";
        }
        return;
    }
    else {
        leaderboard.style.display = "none";
        title.innerHTML = "No leaderboard for these settings";
    }
}

async function submitTimeScore() {
    let username = document.getElementById("name").value;
    let leaderboard = document.getElementById("leaderboard");

    standardOps = ["add", "subtract", "multiply", "divide"];
    console.log(check(operators, standardOps));
    console.log(amountMode);
    console.log(maxQuestions);
    console.log(document.getElementById("max").value);
    console.log(document.getElementById("negatives").checked);
    if (check(operators, standardOps) && amountMode && maxQuestions == 10 && document.getElementById("max").value == 100 && !document.getElementById("negatives").checked) {
        let response = await fetch("https://tutorial-worker.pvanoostveenneo2.workers.dev/leaderboard/default");
        text = await response.text();
        text = JSON.parse(text);
    }
    else {
        return;
    }

    console.log(text);
    score = usedTime / 1000;
    submit = true;
    for (let i = 0; i < text.length; i++) {
        console.log(text[i].name);
        if (username == text[i].name) {
            if (score < text[i].score) {
                text.splice(i, 1);
                break;
            }
            else {
                submit = false;
                break;
            }
        }
    }

    console.log(submit);
    if (submit) {
        for (let i = 0; i < text.length; i++) {
            if (score < text[i].score) {
                text.splice(i, 0, { name: username, score: score });
                submit = false;
                break;
            }
        }
    }
    if (submit) {
        text.push({ name: username, score: score });
    }

    console.log(text);

    leaderboard.style.display = "table";
    leaderboard.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

    for (let i = 0; i < text.length; i++) {
        leaderboard.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + text[i].name + "</td><td>" + text[i].score + "</td></tr>";
    }

    if (check(operators, standardOps) && amountMode && maxQuestions == 10 && document.getElementById("max").value == 100 && !document.getElementById("negatives").checked) {
        let response = await fetch("https://tutorial-worker.pvanoostveenneo2.workers.dev/leaderboard/default", {
            method: "POST",
            body: JSON.stringify(text)
        });
    }
}

usernameInput = document.getElementById("name");
usernameInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && usernameInput.value != "") {
        if (amountMode) {
            /* when doing the quiz with a question goal then score=seconds taken, so lower is better */
            submitTimeScore();
        }
        else {
            /* when doing the quiz with time limit , higer score is better */
            submitAmountScore();
        }
    }
});


function check(targetarr, arr) {
    if (targetarr.length != arr.length) {
        return false;
    }

    for (let i = 0; i < targetarr.length; i++) {
        if (targetarr[i] != arr[i]) {
            return false;
        }
    }

    return true;
}