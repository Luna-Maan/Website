url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/leaderboard"

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
time = 0;
usedTime = 0;
maximum = 0;
negatives = false;
score = 0;

function loadHandler() {
    let add = document.getElementById("add").checked;
    let subtract = document.getElementById("sub").checked;
    let multiply = document.getElementById("mul").checked;
    let divide = document.getElementById("div").checked;

    let exponent = document.getElementById("exp").checked;
    let root = document.getElementById("root").checked;
    let modulo = document.getElementById("mod").checked;

    let det = document.getElementById("determinant").checked;

    let knuth = document.getElementById("knuth").checked;
    let priemn = document.getElementById("priemn").checked;

    let result = document.getElementById("result");
    let stats = document.getElementById("stats");

    maxQuestions = document.getElementById("numQuestions").value;
    maximum = parseInt(document.getElementById("max").value);
    negatives = document.getElementById("negatives").checked;

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
    if (det) {
        numOperators += 1;
        operators.push("det");
    }

    if (numOperators == 0) {
        alert("Please select at least one operator");
        return;
    }

    nextQuestion();
}

window.addEventListener("load", loadHandler);
start = document.getElementById("start");
start.addEventListener("click", loadHandler);

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
    if (operators[operator] === "det") {
        determinantQuestion();
    }

    question.innerHTML = vraag;
    MathJax.typeset();
    questionNum++;
}

/* question types */
function addQuestion() {
    let max = maximum + 1;

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
    let max = maximum + 1;

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
    let max = maximum;

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
    let max = maximum;

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
    let max = maximum;

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
    let max = maximum;

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
    let max = maximum;

    max = Math.ceil(max ** 0.5);

    een = Math.floor(Math.random() * max);
    een = een * een;

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Square_root\">wikipedia: square root</a></span></div>";
    vraag += ": \\(\\sqrt{" + een + "}=\\)";
    answer = een ** 0.5;
}

function knuthQuestion() {
    let max = maximum;

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
    let max = maximum;

    een = Math.floor(Math.random() * (max ** (1 / 3))) + 1;

    priemNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271];

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Prime_number\">wikipedia: prime number.</a> P<sub>n</sub> is the n'th prime number. P<sub>1</sub>=2</span></div>: ";
    vraag += "\\(P_{" + een + "}=\\)";
    answer = priemNumbers[een - 1];
}

function determinantQuestion() {
    let max = maximum;

    // 10: 1x1 mat5rix, 100: 2x2 matrix, 1000: 3x3 matrix, 10000: 4x4 matrix, 100000: 5x5 matrix
    twee = Math.floor(Math.log10(max));

    console.log(10 ** twee);

    // goes up gradially from 10 to 100, then drops back down. goes up to 1000, then drops back down. goes up to 10000, then drops back down. goes up to 100000, then drops back down.
    een = 10 ** (Math.log10(max) - twee) * 0.5 + 8;


    matrix = [];
    for (let i = 0; i < twee; i++) {
        let row = [];
        for (let j = 0; j < twee; j++) {
            row.push(Math.floor(Math.random() * een));
        }
        matrix.push(row);
    }

    console.log(matrix);



    answer = calculateDeterminant(matrix);

    vraag += "<span class=\"tooltiptext\"><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Determinant\">wikipedia: determinant</a></span></div>: ";
    vraag += "\\(\\begin{vmatrix}"

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            vraag += matrix[i][j];
            if (j < matrix.length - 1) {
                vraag += " & ";
            }
        }
        if (i < matrix.length - 1) {
            vraag += " \\\\ ";
        }
    }

    vraag += "\\end{vmatrix}=\\)"
}

function calculateDeterminant(matrix) {

    if (matrix.length == 1) {
        return matrix[0][0];
    }

    if (matrix.length == 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    else {
        let determinant = 0;
        for (let i = 0; i < matrix.length; i++) {
            let minor = [];
            for (let j = 1; j < matrix.length; j++) {
                let row = [];
                for (let k = 0; k < matrix.length; k++) {
                    if (k != i) {
                        row.push(matrix[j][k]);
                    }
                }
                minor.push(row);
            }
            determinant += matrix[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
        }
        return determinant;
    }
}

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
    }
}

function timeEndQuiz() {
    modal = document.getElementById("modal");
    title = document.getElementById("modal-title");
    content = document.getElementById("modal-content");

    score = correct;
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

/* leaderboard and modal */
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
    let name = document.getElementById("name");

    standardOps = ["add", "subtract", "multiply", "divide"];
    hardOps = ["add", "subtract", "multiply", "divide", "exponent", "root", "modulo"];
    if (check(operators, standardOps) && amountMode && maxQuestions == 10 && maximum == 100 && !negatives) {
        boardUrl = url + "/default";
    }
    else if ((check(operators, standardOps) && !amountMode && time == 60 && maximum == 100 && !negatives)) {
        boardUrl = url + "/default_time";
    }
    else if (check(operators, hardOps) && !amountMode && time == 120 && maximum == 500 && negatives) {
        boardUrl = url + "/hard_time";
    }
    else if (check(operators, hardOps) && amountMode && maxQuestions == 15 && maximum == 500 && negatives) {
        boardUrl = url + "/hard";
    }
    else {
        leaderboard.style.display = "none";
        title.innerHTML = "No leaderboard for these settings";
        return;
    }

    let response = await fetch(boardUrl);
    let text = await response.text();
    text = JSON.parse(text);

    leaderboard.style.display = "table";
    title.innerHTML = "Leaderboard for this category:";
    leaderboard.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    name.disabled = false;

    for (let i = 0; i < text.length; i++) {
        leaderboard.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + text[i].name + "</td><td>" + text[i].score + "</td></tr>";
    }
}

async function submitScore() {
    let username = document.getElementById("name").value;
    let leaderboard = document.getElementById("leaderboard");
    let name = document.getElementById("name");

    name.disabled = true;

    standardOps = ["add", "subtract", "multiply", "divide"];
    hardOps = ["add", "subtract", "multiply", "divide", "exponent", "root", "modulo"];
    if (check(operators, standardOps) && amountMode && maxQuestions == 10 && maximum == 100 && !negatives) {
        boardUrl = url + "/default";
    }
    else if ((check(operators, standardOps) && !amountMode && time == 60 && maximum == 100 && !negatives)) {
        boardUrl = url + "/default_time";
    }
    else if (check(operators, hardOps) && !amountMode && time == 120 && maximum == 500 && negatives) {
        boardUrl = url + "/hard_time";
    }
    else if (check(operators, hardOps) && amountMode && maxQuestions == 15 && maximum == 500 && negatives) {
        boardUrl = url + "/hard";
    }
    else {
        return;
    }

    let response = await fetch(boardUrl);
    text = await response.text();
    text = JSON.parse(text);

    console.log(text);

    submit = true;

    inserted = false;
    if (amountMode) {
        score = usedTime / 1000;
        for (let i = 0; i < text.length; i++) {
            console.log(text[i].name);
            if (username == text[i].name) {
                if (score < text[i].score) {
                    text.splice(i, 1);
                    inserted = true;
                    break;
                }
                else {
                    submit = false;
                    break;
                }
            }
        }
        if (submit) {
            for (let i = 0; i < text.length; i++) {
                if (score < text[i].score) {
                    text.splice(i, 0, { name: username, score: score });
                    inserted = true;
                    submit = false;
                    break;
                }
            }
        }
    }
    else {
        score = score;
        for (let i = 0; i < text.length; i++) {
            console.log(text[i].name);
            if (username == text[i].name) {
                if (score > text[i].score) {
                    text.splice(i, 1);
                    inserted = true;
                    break;
                }
                else {
                    submit = false;
                    break;
                }
            }
        }
        if (submit) {
            for (let i = 0; i < text.length; i++) {
                if (score > text[i].score) {
                    text.splice(i, 0, { name: username, score: score });
                    inserted = true;
                    submit = false;
                    break;
                }
            }
        }
    }

    if (submit) {
        text.push({ name: username, score: score });
        inserted = true;
    }

    console.log(text);

    let password = document.getElementById("password").value;
    data = {
        text: text,
        password: password,
        username: username
    }

    leaderboard.style.display = "table";
    leaderboard.innerHTML = "<tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

    for (let i = 0; i < text.length; i++) {
        leaderboard.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + text[i].name + "</td><td>" + text[i].score + "</td></tr>";
    }

    console.log(data);
    if (inserted) {
        response = await fetch(boardUrl, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
}

usernameInput = document.getElementById("name");
usernameInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter" && usernameInput.value != "") {
        submitScore();
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


detectChange = document.getElementById("detectClick");
detectChange.addEventListener("change", function () {
    document.getElementById("presets").value = "-";
});

selectLeaderboard = document.getElementById("presets");
selectLeaderboard.addEventListener("change", function () {
    if (selectLeaderboard.value == "-") {
        return;
    }
    if (selectLeaderboard.value == "amount") {
        document.getElementById("amountMode").checked = true;
        document.getElementById("numQuestions").value = 10;
        document.getElementById("max").value = 100;
        document.getElementById("negatives").checked = false;

        document.getElementById("add").checked = true;
        document.getElementById("sub").checked = true;
        document.getElementById("mul").checked = true;
        document.getElementById("div").checked = true;

        document.getElementById("exp").checked = false;
        document.getElementById("root").checked = false;
        document.getElementById("mod").checked = false;
        document.getElementById("knuth").checked = false;
        document.getElementById("priemn").checked = false;

        document.getElementById("amountInput").style.display = "table-row";
        document.getElementById("timeInput").style.display = "none";
        amountMode = true;
    }
    else if (selectLeaderboard.value == "timed") {
        document.getElementById("timedMode").checked = true;
        document.getElementById("timeLimit").value = 60;
        document.getElementById("max").value = 100;
        document.getElementById("negatives").checked = false;

        document.getElementById("add").checked = true;
        document.getElementById("sub").checked = true;
        document.getElementById("mul").checked = true;
        document.getElementById("div").checked = true;

        document.getElementById("exp").checked = false;
        document.getElementById("root").checked = false;
        document.getElementById("mod").checked = false;
        document.getElementById("knuth").checked = false;
        document.getElementById("priemn").checked = false;

        document.getElementById("amountInput").style.display = "none";
        document.getElementById("timeInput").style.display = "table-row";
        amountMode = false;
    }
    else if (selectLeaderboard.value == "hardTimed") {
        document.getElementById("timedMode").checked = true;
        document.getElementById("timeLimit").value = 120;
        document.getElementById("max").value = 500;
        document.getElementById("negatives").checked = true;

        document.getElementById("add").checked = true;
        document.getElementById("sub").checked = true;
        document.getElementById("mul").checked = true;
        document.getElementById("div").checked = true;

        document.getElementById("exp").checked = true;
        document.getElementById("root").checked = true;
        document.getElementById("mod").checked = true;
        document.getElementById("knuth").checked = false;
        document.getElementById("priemn").checked = false;

        document.getElementById("amountInput").style.display = "none";
        document.getElementById("timeInput").style.display = "table-row";
        amountMode = false;
    }
    else if (selectLeaderboard.value == "hardAmount") {
        document.getElementById("timedMode").checked = false;
        document.getElementById("numQuestions").value = 15;
        document.getElementById("max").value = 500;
        document.getElementById("negatives").checked = true;

        document.getElementById("add").checked = true;
        document.getElementById("sub").checked = true;
        document.getElementById("mul").checked = true;
        document.getElementById("div").checked = true;

        document.getElementById("exp").checked = true;
        document.getElementById("root").checked = true;
        document.getElementById("mod").checked = true;
        document.getElementById("knuth").checked = false;
        document.getElementById("priemn").checked = false;

        document.getElementById("amountInput").style.display = "table-row";
        document.getElementById("timeInput").style.display = "none";
        amountMode = true;
    }
});