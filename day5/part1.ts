/*

Brainstorming:

We can turn the ranges into a hashmap to allow for O(1) lookups.

Doing so is O(N) time complexity and O(N) space complexity where N is the max id range

The subsequent querying would be O(m) time complexity where m is the list of available ingredient IDs

---

Alternatively, I know that many DBs use something called a b-tree (different than a simple binary tree, though maybe that works here?).

A b tree/heap datastructure means we can trade the O(n) space complexity of the hashmap lookup for a smaller O(n). For example:

3-5
10-14
16-20

With a hashmap, the above input becomes something like:

{
    3,
    4,
    5,
    10,
    ...
    20
}

With a btree/heap, the above input is:

        (10, 14)

    (3, 5)     (16, 20)

So much smaller in memory, but lookups are O(logn)

Looking at the input, we shouldn't even consider the first option since the ranges are HUGE, and just go with the b tree.
And by b tree I mean BST, since we don't need to insert.
*/

import fs from 'node:fs';

type IdRange = [number, number];

type BinarySearchTreeNode = {
    val: IdRange,
    left?: BinarySearchTreeNode,
    right?: BinarySearchTreeNode 
};

class FreshIngredientDatabase {
    private rootNode: BinarySearchTreeNode;

    constructor(idRanges: IdRange[]) {
        this.rootNode = this.constructNode(this.sortAndMergeRanges(idRanges)) as BinarySearchTreeNode;
    }

    private constructNode(idRanges: IdRange[]): BinarySearchTreeNode | undefined {
        if (!idRanges.length) {
            return undefined;
        }

        // leaf node
        if (idRanges.length == 1) {
            return {
                val: idRanges[0]
            }
        }

        const midPoint = Math.floor(idRanges.length / 2);
        return {
            val: idRanges[midPoint],
            left: this.constructNode(idRanges.slice(0,midPoint)),
            right: this.constructNode(idRanges.slice(midPoint+1)),
        }
    }

    private rangesOverlap([s1, e1]: IdRange, [s2, e2]: IdRange): boolean {
        return Math.min(e1, e2) >= Math.max(s1, s2);
    }

    private mergeRanges([s1, e1]: IdRange, [s2, e2]: IdRange): IdRange {
        return [Math.min(s1, s2), Math.max(e1, e2)];
    }

    // O(nlogn)
    private sortAndMergeRanges(idRanges: IdRange[]): IdRange[] {

        // O(nlogn)
        const sortedRanges = idRanges.sort(([a], [b]) => a - b);
        const sortedAndMergedRanges: IdRange[] = [sortedRanges[0]];

        // O(n)
        for (let i = 1; i < sortedRanges.length; i++) {
            // if overlaps with last pushed, overwrite last pushed. else just push
            const lastRange = sortedAndMergedRanges.pop() as IdRange;
            const currentRange = sortedRanges[i];
            if (this.rangesOverlap(lastRange, currentRange)) {
                sortedAndMergedRanges.push(this.mergeRanges(lastRange, currentRange));
            } else {
                sortedAndMergedRanges.push(lastRange);
                sortedAndMergedRanges.push(currentRange);
            }
        }

        return sortedAndMergedRanges;
    }

    query(id: number): boolean {
        let exists = false;
        let currentNode: BinarySearchTreeNode = this.rootNode;
        while(currentNode !== undefined) {
            const [start, end] = currentNode.val;
            if(id <= end && id >= start) {
                exists = true;
                break;
            } 

            currentNode = id < start ? currentNode.left as BinarySearchTreeNode : currentNode.right as BinarySearchTreeNode;
        }

        return exists;
    }
}

function getInput(inputFile: string): { idRanges: IdRange[], ids: number[]}  {
    const inputLines: string[] = fs.readFileSync(inputFile, 'utf-8').split('\n');
    const inputBreak = inputLines.indexOf('');

    return {
        idRanges: inputLines.slice(0, inputBreak).map((rawRange) => rawRange.split('-').map((s) => parseInt(s)) as IdRange),
        ids: inputLines.slice(inputBreak + 1).map((s) => parseInt(s))
    }
}


const {idRanges, ids} = getInput('input.txt')

const freshDb = new FreshIngredientDatabase(idRanges);
const freshIngredients = ids.reduce((freshCount, id) => freshDb.query(id) ? freshCount + 1 : freshCount, 0);

console.log(freshIngredients)