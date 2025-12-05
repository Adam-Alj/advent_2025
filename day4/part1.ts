import fs from 'fs';

const directions = [
    [0,1], 
    [0,-1],
    [1,0], 
    [-1,0],
    [1,1], 
    [1,-1],
    [-1,1],
    [-1,-1],
];


function isRollAccessible(grid: string[][], x: number, y: number ): boolean {
    const getCharAtCoords = (a: number, b: number) => a >= 0 && b >= 0 && a < grid[0].length && b < grid[0].length ? grid[a][b] : '.'

    const nearbyRolls = directions.reduce((acc, cur) => acc + (getCharAtCoords(cur[0] + x, cur[1] + y) == '@' ? 1 : 0), 0);

    return nearbyRolls < 4;
}

function numAccessibleRolls(grid: string[][]): number {
    return grid.reduce((acc, cur, x) => {
        return acc + cur.reduce((iacc, icur, y) => {
            if (icur === '@') {
                return iacc + (isRollAccessible(grid, x, y) ? 1 : 0);
            } else {
                return iacc;
            }
        }, 0);
    }, 0);
}

// useful visualizer helper
function testModifyAccessibleRolls(grid: string[][]): string[] {
    return grid.map((ov, o) => {
        return ov.map((cur, i) => {
            return cur === '@' && isRollAccessible(grid, o, i) ? 'x' : grid[o][i];
        }).join('')
    });
}
//inputGrid.forEach((e) => console.log(e.join('')))
//console.log('\n---------------\n')
//testModifyAccessibleRolls(inputGrid).forEach((e) => console.log(e));

const inputGrid: string[] = fs.readFileSync('input.txt', 'utf-8').split('\n').map(a => a.split(''));


console.log(numAccessibleRolls(inputGrid))

