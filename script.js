const display = document.getElementById('display');
let currentInput = '';
let operator = null;
let firstOperand = null;
let shouldResetDisplay = false;

function clearDisplay() {
    currentInput = '';
    operator = null;
    firstOperand = null;
    display.value = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    if (shouldResetDisplay) {
        clearDisplay();
        return;
    }
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput || '0'; // Show 0 if empty
}

function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput += number;
    }
    display.value = currentInput;
}

function appendDecimal() {
    if (shouldResetDisplay) {
        clearDisplay();
        currentInput = '0.'; // Start new input with 0.
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    display.value = currentInput;
}

function appendOperator(op) {
    // Allow changing operator if last action was operator input
    if (operator && !shouldResetDisplay) {
        calculateResult(); // Calculate intermediate result if needed
    }

    if (currentInput !== '' || firstOperand !== null) { // Ensure there's a number to operate on
        firstOperand = parseFloat(currentInput || firstOperand); // Use current input or previous result
        operator = op;
        shouldResetDisplay = true; // Next number input should reset display
        currentInput = ''; // Clear current input for next operand
    }
}


function calculateResult() {
    if (operator === null || firstOperand === null || shouldResetDisplay) {
        // Don't calculate if no operator, no first operand, or just after an operator press
        return;
    }

    const secondOperand = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                display.value = 'Error!';
                // Reset state after error
                currentInput = '';
                operator = null;
                firstOperand = null;
                shouldResetDisplay = true;
                return;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return; // Should not happen
    }

    // Handle potential floating point inaccuracies for display
    result = parseFloat(result.toPrecision(12));

    display.value = result;
    currentInput = String(result); // Store result as current input for chaining operations
    operator = null; // Reset operator for next operation
    firstOperand = result; // Store result as first operand for chaining
    shouldResetDisplay = true; // Next number input should reset display
}

// Initialize display
clearDisplay();
display.value = '0'; // Start with 0 on display
