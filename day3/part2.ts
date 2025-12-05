import * as fs from 'fs';

const inputBanks = fs.readFileSync("input.txt", 'utf-8').split('\n');

const getMaxJoltage = (inputBanks: string[]) => {
    let memo: Record<string, string> = {};

    const maxJoltageInner = (inputBank: string, remainingSelections: number): string => {

        const memoHash = (n: number, p: number) => `n${n}-${p}`;

        if (memo[memoHash(inputBank.length, remainingSelections)]) {
            return memo[memoHash(inputBank.length, remainingSelections)];
        }

        if (!remainingSelections) {
            return "";
        }

        if (inputBank.length < remainingSelections) {
            throw new Error("this should never happen");
        }

        if (inputBank.length == remainingSelections) {
            return inputBank;
        }

        // iterate over the remaining valid options for selection. 
        // Compute selecting the current option and each of those.
        // Also compute *not* selecting the current option.
        // Take the larger of the two, but MEMOIZE EACH
        const subMaximumSelections = [];
        const selection = inputBank.charAt(0), remainingBank = inputBank.slice(1);
        for (let i = 0; i <= remainingBank.length - remainingSelections; i++) {
            const remainingBankInner = remainingBank.slice(i);

            const computedSelect = maxJoltageInner(remainingBankInner, remainingSelections - 1);
            memo[memoHash(remainingBankInner.length, remainingSelections-1)] = computedSelect;
            const select = selection + computedSelect
            
            const noSelect = maxJoltageInner(remainingBankInner, remainingSelections);
            memo[memoHash(remainingBankInner.length, remainingSelections)] = noSelect;

            subMaximumSelections.push(Math.max(parseInt(select), parseInt(noSelect)));
        }

        const subMax = Math.max(...subMaximumSelections).toString();

        if (subMax.length !== remainingSelections) {
            throw new Error(`The fn should only return its computed sub problem\n${subMax} with ${remainingSelections} remaining selections`)
        }
        return subMax;
    }
    

    const result = inputBanks.reduce((acc, cur) => {
        memo = {};
        return acc + parseInt(maxJoltageInner(cur, 12))
    }, 0);
    console.log(memo);
    return result;
}

console.log(getMaxJoltage(inputBanks));