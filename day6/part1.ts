import fs from 'node:fs';

function parseInput(inputFile: string): string[][] {
    const inputLines: string[] = fs.readFileSync(inputFile, 'utf-8').split('\n');
    return inputLines.map((line) => line.split(' ').filter((s) => s));
}

const getOperatorFn = (operator: string): (a: number, b: number) => number => 
    operator == '*'
        ? (a, b) => a * b
        : (a, b) => a + b

function solveHomework(homeworkSheet: string[][]): number {
    // O(m)
    return homeworkSheet[homeworkSheet.length-1].reduce((grandTotal, operation, problemIndex) => {
        const operate = getOperatorFn(operation);

        let answer = operation == '*' ? 1 : 0;
        // O(n)
        for (let i = 0; i < homeworkSheet.length - 1; i++) {
            answer = operate(answer, parseInt(homeworkSheet[i][problemIndex]));
        }

        return grandTotal + answer;
    }, 0);
}

// where n = problem size
// and   m = number of problems

console.log(solveHomework(parseInput('input.txt')))