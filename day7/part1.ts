/*
    A fun one by the looks of it. I think that the trick here is that we can't double count beams.
    When we are creating a new beam, we need to consult whether or not that beam already exists in that position


*/

import fs from 'node:fs';

function parseInput(inputFile: string): string[][] {
    return fs.readFileSync(inputFile, 'utf-8').split('\n');
}

function getNumSplitsFromShotBeam(grid: string[][]): number {
    const beamLocations = new Set<number>([grid[0].indexOf('S')])

    return grid.slice(1).reduce((totalBeamSplitCount, currentRow) => {
        let rowSplitCount = 0;
        for (const beamIndex of beamLocations.values()) {
            if (currentRow[beamIndex] === '^') {
                rowSplitCount++;
                beamLocations.delete(beamIndex);
                beamLocations.add(beamIndex-1);
                beamLocations.add(beamIndex+1);
            }
        }

        return totalBeamSplitCount + rowSplitCount;
    }, 0);
}

const input = parseInput('input.txt');
console.log(input);

const result = getNumSplitsFromShotBeam(input);
console.log(result);