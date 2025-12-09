
import fs from 'node:fs';

function parseRawInput(inputFile: string): number[][] {
    return fs.readFileSync(inputFile, 'utf-8').split('\n').map((e) => e.split(',').map((e) => parseInt(e)));
}

function calculateArea([x1, y1]: number[], [x2, y2]: number[]): number {
    return (Math.abs(x2 - x1) + 1) * (Math.abs(y2-y1) + 1);
}

function maxRectangleFromCoords(coordinates: number[][]): number {
    let maxRectangleArea = 0;

    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i+1; j < coordinates.length; j++) {
            const rectangleArea = calculateArea(coordinates[i], coordinates[j]) 
            maxRectangleArea = Math.max(maxRectangleArea, rectangleArea);
        }
    }

    return maxRectangleArea;
}


const rawInput = parseRawInput("input.txt")
const result = maxRectangleFromCoords(rawInput);

console.log(result)