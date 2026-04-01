// VARIABLES - These store information the calculator needs to remember
let displayValue = '0';        // What's shown on screen (starts as '0')
let firstNumber = null;        // The first number you typed (like "5" in "5 + 3")
let operator = null;           // The operation you chose (+, -, ×, /)
let waitingForSecondNumber = false;  // Are we waiting for the second number?

// Get the display element so we can change what it shows
const display = document.getElementById('display');

// ===== FUNCTION 1: Update the Display =====
// This function changes what you see on the calculator screen
function updateDisplay() {
    display.textContent = displayValue;
}

// ===== FUNCTION 2: Append a Number =====
// This runs when you click a number button (0-9 or .)
function appendNumber(number) {
    // If we're waiting for second number, start fresh
    if (waitingForSecondNumber) {
        displayValue = number;
        waitingForSecondNumber = false;
    } else {
        // If display shows '0', replace it. Otherwise, add to the end
        if (displayValue === '0' && number !== '.') {
            displayValue = number;
        } else {
            // Don't allow multiple decimal points
            if (number === '.' && displayValue.includes('.')) {
                return;  // Stop here, don't add another dot
            }
            displayValue += number;  // Add number to the end (like "12" becomes "123")
        }
    }
    updateDisplay();  // Show the new number on screen
}

// ===== FUNCTION 3: Append an Operator =====
// This runs when you click +, -, ×, or /
function appendOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);  // Convert text to number
    
    // If there's already a calculation waiting, do it first
    if (operator && waitingForSecondNumber) {
        operator = nextOperator;  // Just change the operator
        return;
    }
    
    // If this is the first number
    if (firstNumber === null) {
        firstNumber = inputValue;  // Remember this number
    } else if (operator) {
        // If there's already an operator, calculate the result
        const result = calculate();
        displayValue = String(result);
        firstNumber = result;
    }
    
    waitingForSecondNumber = true;  // Now we're waiting for the second number
    operator = nextOperator;  // Remember which operation (+, -, ×, /)
    updateDisplay();
}

// ===== FUNCTION 4: Calculate the Result =====
// This runs when you click "=" or when chaining operations
function calculate() {
    let result;
    const inputValue = parseFloat(displayValue);  // Second number
    
    // If we don't have both numbers, just return current value
    if (firstNumber === null || !operator) {
        return inputValue;
    }
    
    // Do the math based on which operator was clicked
    switch (operator) {
        case '+':
            result = firstNumber + inputValue;
            break;
        case '-':
            result = firstNumber - inputValue;
            break;
        case '*':
            result = firstNumber * inputValue;
            break;
        case '/':
            // Check for division by zero
            if (inputValue === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return 0;
            }
            result = firstNumber / inputValue;
            break;
        default:
            return inputValue;
    }
    
    // Round to avoid long decimals like 0.30000000004
    result = Math.round(result * 100000000) / 100000000;
    
    // Reset for next calculation
    displayValue = String(result);
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    
    updateDisplay();
    return result;
}

// ===== FUNCTION 5: Clear Everything =====
// This runs when you click "C"
function clearDisplay() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay();
}

// ===== FUNCTION 6: Delete Last Digit =====
// This runs when you click the backspace button "⌫"
function deleteDigit() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);  // Remove last character
    } else {
        displayValue = '0';  // If only one digit left, show 0
    }
    updateDisplay();
}

// ===== BONUS: Keyboard Support =====
// Let users type on keyboard instead of clicking buttons
document.addEventListener('keydown', function(event) {
    // If user presses a number key (0-9)
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    }
    // If user presses decimal point
    else if (event.key === '.') {
        appendNumber('.');
    }
    // If user presses operators
    else if (event.key === '+') {
        appendOperator('+');
    }
    else if (event.key === '-') {
        appendOperator('-');
    }
    else if (event.key === '*') {
        appendOperator('*');
    }
    else if (event.key === '/') {
        event.preventDefault();  // Stop browser search from opening
        appendOperator('/');
    }
    // If user presses Enter or =
    else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    }
    // If user presses Escape or c
    else if (event.key === 'Escape' || event.key === 'c') {
        clearDisplay();
    }
    // If user presses Backspace
    else if (event.key === 'Backspace') {
        event.preventDefault();  // Stop browser back button
        deleteDigit();
    }
});

console.log('Calculator loaded! You can click buttons or use your keyboard.');
