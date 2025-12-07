/*

Literally dfs with an accumulator

*/
import fs from 'node:fs';

function parseInput(inputFile: string): string[][] {
    return fs.readFileSync(inputFile, 'utf-8').split('\n');
}

function quantumBeamPath(grid: string[][]): number {

    const memoMap: Record<string, number> = {};
    const memoHash = (x: number, y: number) => `x${x}-y${y}`

    const quantumBeamPathInner = (rowIndex: number, beamIndex: number): number => {
        if (rowIndex == grid.length - 1) {
            return 1;
        }
        if (memoMap[memoHash(rowIndex, beamIndex)]) {
            return memoMap[memoHash(rowIndex, beamIndex)];
        }

        if (grid[rowIndex][beamIndex] == '^') {

            const leftPath = quantumBeamPathInner(rowIndex + 1, beamIndex - 1);
            memoMap[memoHash(rowIndex + 1, beamIndex - 1)] = leftPath;

            const rightPath = quantumBeamPathInner(rowIndex + 1, beamIndex + 1);
            memoMap[memoHash(rowIndex + 1, beamIndex + 1)] = rightPath;

            return leftPath + rightPath;
        } else {
            const straightPath = quantumBeamPathInner(rowIndex + 1, beamIndex);
            memoMap[memoHash(rowIndex, beamIndex)] = straightPath;

            return straightPath;
        }
    }

    return quantumBeamPathInner(1, grid[0].indexOf('S'));
}

const input = parseInput('input.txt');

console.log(input)

const result = quantumBeamPath(input);

console.log(result);