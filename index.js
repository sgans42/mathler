const arr = Array.from({ length: 10 }, () => Array.from({ length: 3 }, () => Array(6).fill(null)));
const operators = ['+', '-', '*', '/'];

operators.forEach(op => {
    arr[op] = Array.from({ length: 3 }, () => Array(6).fill(null));
});

function updateRow(rowIndex) {
    let rowClass = "prac0-row" + rowIndex;
    let inputElements = document.getElementsByClassName(rowClass);

    for (let i = 0; i < inputElements.length; i++) {
        let value = inputElements[i].value;
        let status = 0;

        if (inputElements[i].classList.contains('color1')) {
            status = 0; // grey
        } else if (inputElements[i].classList.contains('color2')) {
            status = 1; // yellow
        } else if (inputElements[i].classList.contains('color3')) {
            status = 2; // green
        }

        if (isNaN(value)) {
            if (!arr[value]) {
                arr[value] = Array.from({ length: 3 }, () => Array(6).fill(null));
            }
            arr[value][status][i] = true;
        } else {
            arr[parseInt(value)][status][i] = true;
        }
    }

    console.log('Array updated: ', arr);
    updateValueStatus();
}

function updateValueStatus() {
    // Update green values
    for (let i = 0; i < 6; i++) {
        let greenValueBox = document.getElementById(`green-value-${i}`);
        greenValueBox.textContent = '';
        for (let value in arr) {
            if (arr[value][2] && arr[value][2][i]) {
                greenValueBox.textContent = value;
            }
        }
    }

    // Update number colors
    for (let i = 0; i < 10; i++) {
        let numberBox = document.getElementById(`number-status-${i}`);
        numberBox.style.backgroundColor = '';
        if (arr[i][2] && arr[i][2].includes(true)) {
            numberBox.style.backgroundColor = 'lime';
        } else if (arr[i][1] && arr[i][1].includes(true)) {
            numberBox.style.backgroundColor = 'yellow';
        } else if (arr[i][0] && arr[i][0].includes(true)) {
            numberBox.style.backgroundColor = 'grey';
        }
        numberBox.textContent = i;
    }

    // Update operator colors
    const operatorMap = {
        '+': 'plus',
        '-': 'minus',
        '*': 'multiply',
        '/': 'divide'
    };

    for (let op of operators) {
        let operatorBox = document.getElementById(`operator-status-${operatorMap[op]}`);
        operatorBox.style.backgroundColor = '';
        if (arr[op][2] && arr[op][2].includes(true)) {
            operatorBox.style.backgroundColor = 'lime';
        } else if (arr[op][1] && arr[op][1].includes(true)) {
            operatorBox.style.backgroundColor = 'yellow';
        } else if (arr[op][0] && arr[op][0].includes(true)) {
            operatorBox.style.backgroundColor = 'grey';
        }
    }
}

function cycleColor(element) {
    if (element.classList.contains('color1')) {
        element.classList.remove('color1');
        element.classList.add('color2');
    } else if (element.classList.contains('color2')) {
        element.classList.remove('color2');
        element.classList.add('color3');
    } else if (element.classList.contains('color3')) {
        element.classList.remove('color3');
    } else {
        element.classList.add('color1');
    }
}

function updateTarget() {
    var targetElement = document.getElementById("target");
    var resultElement = document.getElementById("result");

    var targetValue = targetElement.value.trim();

    if (targetValue !== "") {
        resultElement.textContent = "Target: " + targetValue;
    } else {
        resultElement.textContent = "";
    }
}

function handleInput(event, currentIndex) {
    var inputElements = document.getElementsByClassName("prac");
    var nextIndex = currentIndex + 1;

    if (event.inputType === "deleteContentBackward") {
        event.preventDefault();
        inputElements[currentIndex].value = "";
        calculateDivision();
    } else if (nextIndex < inputElements.length && inputElements[nextIndex].value === "") {
        inputElements[nextIndex].focus();
    }

    calculateDivision();
}

function handleColorInput(event, currentIndex, rowIndex) {
    var rowClass = "prac0-row" + rowIndex;
    var inputElements = document.getElementsByClassName(rowClass);
    var nextIndex = currentIndex + 1;

    if (event.inputType === "deleteContentBackward") {
        event.preventDefault();
        inputElements[currentIndex].value = "";
    } else if (nextIndex < inputElements.length && inputElements[nextIndex].value === "") {
        inputElements[nextIndex].focus();
    }

    cycleColor(event.target);
}

function clearInputs() {
    var inputElements = document.getElementsByClassName("prac");

    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = "";
    }
    document.getElementById("result").textContent = "";
}

function calculateDivision() {
    var inputElements = document.getElementsByClassName("prac");
    var resultElement = document.getElementById("result");
    var targetElement = document.getElementById("target");

    var expression = "";

    for (var i = 0; i < inputElements.length; i++) {
        var inputValue = inputElements[i].value.trim();
        if (inputValue !== "") {
            expression += inputValue;
        }
    }

    var result;
    try {
        result = eval(expression);
    } catch (error) {
        result = "Invalid expression";
    }

    resultElement.textContent = "Result: " + result;

    var targetValue = targetElement.value.trim();
    var difference = targetValue - result;

    resultElement.textContent += " (Difference: " + difference + ")";
}

function calculateUnusedNumbersSolution() {
    let target = parseInt(document.getElementById("target").value.trim());
    if (isNaN(target)) {
        document.getElementById("unused-numbers-solution").textContent = "Solution with Most Unused Numbers: Invalid target";
        return;
    }

    let unusedValues = [];
    let yellowValues = [];
    let usedValues = new Set();

    for (let value in arr) {
        if (arr[value][2].includes(true)) {
            usedValues.add(value);
        } else if (arr[value][1].includes(true)) {
            yellowValues.push(parseInt(value));
        } else if (!isNaN(value)) {
            unusedValues.push(parseInt(value));
        }
    }

    unusedValues.sort((a, b) => b - a);
    yellowValues.sort((a, b) => b - a);

    let allValues = unusedValues.concat(yellowValues).concat(Array.from(usedValues).map(Number)).sort((a, b) => b - a);

    let solution = '';
    let bestScore = -1;

    // Try forming the solution as 1XX - XX = target using the most unused numbers
    for (let i = 100; i <= 199; i++) {
        for (let j = 0; j <= 99; j++) {
            let result = i - j;
            if (result === target) {
                let equation = `${i}-${j.toString().padStart(2, '0')}`;
                if (equation.length === 6) {
                    let usedInEquation = new Set(equation.split('').filter(char => !isNaN(char)).map(Number));
                    let unusedCount = Array.from(usedInEquation).filter(num => unusedValues.includes(num)).length;
                    let yellowCount = Array.from(usedInEquation).filter(num => yellowValues.includes(num)).length;
                    let score = (unusedCount * 2) + yellowCount; // Prioritize unused numbers over yellow
                    if (score > bestScore) {
                        solution = equation;
                        bestScore = score;
                    }
                }
            }
        }
    }

    if (!solution) {
        solution = 'No solution found';
    }

    document.getElementById("unused-numbers-solution").textContent = "Solution with Most Unused Numbers: " + solution;
}

function calculateUnusedNumbersSolution() {
    let target = parseInt(document.getElementById("target").value.trim());
    if (isNaN(target)) {
        document.getElementById("unused-numbers-solution").textContent = "Solution with Most Unused Numbers: Invalid target";
        return;
    }

    let unusedValues = [];
    let yellowValues = [];
    let usedValues = new Set();

    for (let value in arr) {
        if (arr[value][2].includes(true)) {
            usedValues.add(value);
        } else if (arr[value][1].includes(true)) {
            yellowValues.push(parseInt(value));
        } else if (!isNaN(value)) {
            unusedValues.push(parseInt(value));
        }
    }

    unusedValues.sort((a, b) => b - a);
    yellowValues.sort((a, b) => b - a);

    let allValues = unusedValues.concat(yellowValues).concat(Array.from(usedValues).map(Number)).sort((a, b) => b - a);

    let solution = '';
    let bestScore = -1;

    // Try forming the solution as 1XX - XX = target using the most unused numbers
    for (let i = 100; i <= 199; i++) {
        for (let j = 0; j <= 99; j++) {
            let result = i - j;
            if (result === target) {
                let equation = `${i}-${j.toString().padStart(2, '0')}`;
                if (equation.length === 6) {
                    let usedInEquation = new Set(equation.split('').filter(char => !isNaN(char)).map(Number));
                    let unusedCount = Array.from(usedInEquation).filter(num => unusedValues.includes(num)).length;
                    let yellowCount = Array.from(usedInEquation).filter(num => yellowValues.includes(num)).length;
                    let score = (unusedCount * 2) + yellowCount; // Prioritize unused numbers over yellow
                    if (score > bestScore) {
                        solution = equation;
                        bestScore = score;
                    }
                }
            }
        }
    }

    if (!solution) {
        solution = 'No solution found';
    }

    document.getElementById("unused-numbers-solution").textContent = "Solution with Most Unused Numbers: " + solution;
}

function findAllCombinationsSolution() {
    let target = parseInt(document.getElementById("target").value.trim());
    if (isNaN(target)) {
        document.getElementById("all-combinations-solution").textContent = "All Combinations Solution: Invalid target";
        return;
    }

    let greenValues = new Array(6).fill(null);
    let yellowValues = [];
    let usedCombinations = new Set();

    // Collect green and yellow values
    for (let value in arr) {
        for (let i = 0; i < 6; i++) {
            if (arr[value][2][i] === true) {
                greenValues[i] = value;
            } else if (arr[value][1][i] === true) {
                yellowValues.push({ value: value, index: i });
            }
        }
    }

    // Generate permutations of yellow values
    function* permutations(arr) {
        if (arr.length === 0) yield [];
        else {
            let [first, ...rest] = arr;
            for (let perm of permutations(rest)) {
                for (let i = 0; i <= perm.length; i++) {
                    yield [...perm.slice(0, i), first, ...perm.slice(i)];
                }
            }
        }
    }

    // Try all permutations of yellow values
    let solutions = [];
    for (let perm of permutations(yellowValues)) {
        let expression = '';
        let permIndex = 0;
        let usedIndexes = new Set();

        for (let i = 0; i < 6; i++) {
            if (greenValues[i] !== null) {
                expression += greenValues[i];
            } else if (permIndex < perm.length) {
                while (usedIndexes.has(perm[permIndex].index)) {
                    permIndex++;
                }
                expression += perm[permIndex].value;
                usedIndexes.add(perm[permIndex].index);
            } else {
                expression += '0'; // Fallback for missing values
            }
        }

        if (!usedCombinations.has(expression)) {
            try {
                if (eval(expression) === target) {
                    solutions.push(expression);
                    usedCombinations.add(expression);
                }
            } catch (e) {
                // Ignore invalid expressions
            }
        }
    }

    if (solutions.length === 0) {
        solutions.push('No solution found');
    }

    document.getElementById("all-combinations-solution").textContent = "All Combinations Solution: " + solutions.join(', ');
}
