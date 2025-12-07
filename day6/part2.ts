import fs from 'node:fs';

function parseInput(inputFile: string): string[][] {
    const inputLines: string[] = fs.readFileSync(inputFile, 'utf-8').split('\n');
    return inputLines.map((line) => line.split('').filter((s) => s));
}

const getOperatorFn = (operator: string): (a: number, b: number) => number => 
    operator == '*'
        ? (a, b) => a * b
        : (a, b) => a + b

function solveHomework(homeworkSheet: string[][]): number {
    let grandTotal = 0;
    let runningResult = 0;
    let operate = getOperatorFn('+');

    // O( m )
    for (let i = 0; i < homeworkSheet[0].length; i++) {
        const charAtOperatorPosition = homeworkSheet[homeworkSheet.length-1][i];

        if (charAtOperatorPosition == '*' || charAtOperatorPosition == '+') {
            grandTotal += runningResult;
            runningResult = charAtOperatorPosition == '*' ? 1 : 0;
            operate = getOperatorFn(charAtOperatorPosition);
        }

        let numberFromColumn = "";
        // O( n )
        for (let j = 0; j < homeworkSheet.length - 1; j++) {
            numberFromColumn += homeworkSheet[j][i];
        }

        if (numberFromColumn.trim()) {
            runningResult = operate(runningResult, parseInt(numberFromColumn));
        }
    }

    return grandTotal + runningResult;
}

// where n = problem size
// and   m = number of problems
const input = parseInput('input.txt')

const result = solveHomework(input);
console.log(result);