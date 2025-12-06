import fs from 'node:fs';

type IdRange = [number, number];

function rangesOverlap([s1, e1]: IdRange, [s2, e2]: IdRange): boolean {
    return Math.min(e1, e2) >= Math.max(s1, s2);
}

function mergeRanges([s1, e1]: IdRange, [s2, e2]: IdRange): IdRange {
    return [Math.min(s1, s2), Math.max(e1, e2)];
}

// O(nlogn)
function sortAndMergeRanges(idRanges: IdRange[]): IdRange[] {

    // O(nlogn)
    const sortedRanges = idRanges.sort(([a], [b]) => a - b);
    const sortedAndMergedRanges: IdRange[] = [sortedRanges[0]];

    // O(n)
    for (let i = 1; i < sortedRanges.length; i++) {
        // if overlaps with last pushed, overwrite last pushed. else just push
        const lastRange = sortedAndMergedRanges.pop() as IdRange;
        const currentRange = sortedRanges[i];
        if (rangesOverlap(lastRange, currentRange)) {
            sortedAndMergedRanges.push(mergeRanges(lastRange, currentRange));
        } else {
            sortedAndMergedRanges.push(lastRange);
            sortedAndMergedRanges.push(currentRange);
        }
    }

    return sortedAndMergedRanges;
}

function getInput(inputFile: string): { idRanges: IdRange[], ids: number[]}  {
    const inputLines: string[] = fs.readFileSync(inputFile, 'utf-8').split('\n');
    const inputBreak = inputLines.indexOf('');

    return {
        idRanges: inputLines.slice(0, inputBreak).map((rawRange) => rawRange.split('-').map((s) => parseInt(s)) as IdRange),
        ids: inputLines.slice(inputBreak + 1).map((s) => parseInt(s))
    }
}


const {idRanges} = getInput('input.txt')
const totalPossibleFreshIngredients = sortAndMergeRanges(idRanges).reduce((total, [start, end]) => total + end - start + 1, 0);

console.log(totalPossibleFreshIngredients);