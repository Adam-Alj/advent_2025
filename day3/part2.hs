{-

    The first real difficult problem.
    I don't see how you can do this *without* dynamic programming.

    Consider a more palatable problem with 3 batteries being enabled.

    Given "15236" the answer should be "536"

    We need to memoize {index - depth}.

    Notes: 
        - Picking next candidate means length determination. If we have 
          two enablements left we can't choose the last element as our second pick
          Formally:
            len [candidate .. end] >= remaining enablements
-}

import qualified Data.Map as Map
import Data.List (foldl')
import Debug.Trace (trace)

maxJoltage :: [Char] -> [Char]
maxJoltage bank = fst $ maxJoltage' (length bank) bank "" 0 12 Map.empty
    where
        maxJoltage' :: Int -> [Char] -> [Char] -> Int -> Int -> Map.Map [Char] [Char] -> ([Char], Map.Map [Char] [Char])
        maxJoltage' _ _ acc _ 0 map = (acc, map)
        maxJoltage' totalBatteries remainingBatteries acc batteryNum remainingSelections visitedMap
            | Map.member currentHash visitedMap = (acc ++ visitedMap Map.! currentHash, visitedMap)
            | length remainingBatteries == remainingSelections = 
                (acc ++ remainingBatteries, Map.insert currentHash remainingBatteries visitedMap)
            | otherwise =
                let
                    maxJoltageInner' (maxJ, vMap) i
                        | maxJ < curJ = (curJ, newMap)
                        | otherwise = (maxJ, newMap)
                        where
                            (curJ, newMap) =
                                maxJoltage' totalBatteries (drop i remainingBatteries) (acc ++ [head remainingBatteries]) i (remainingSelections - 1) visitedMap
                    -- pick this value
                    inner@(innerResultMax, visMap) =  foldl' maxJoltageInner' ("0", visitedMap) [1..length remainingBatteries - remainingSelections]
                    -- don't pick this value
                    outer@(outerResultMax, visMapO) = maxJoltage' totalBatteries (tail remainingBatteries) acc (batteryNum + 1) remainingSelections visMap
                in 
                    --trace ("Battery #" ++ show batteryNum ++ "/" ++ show totalBatteries ++ 
                            --" | Remaining: " ++ show remainingSelections ++ 
                            --" | Acc: \"" ++ acc ++ "\" | RemBatt: \"" ++ remainingBatteries ++ "\"" ++
                            --" | Inner: \"" ++ fst inner ++ "\" | Outer: \"" ++ fst outer ++ "\"") 
                        max inner outer

            where
                currentHash = show batteryNum ++ "-" ++ show remainingSelections
        -- use foldl


main :: IO ()
main = do
    rawInput <- readFile "input.txt"
    print . foldl (\a c -> a + (read c :: Int)) 0 . map maxJoltage $ lines rawInput
    return ()

{-
    I do not like having to implement memoization in haskell, it's really annoying.
    Passes example, runs on input for too long to get an answer.
    Do not understand why my memoization isn't doing work.

    This was too hard, just ended up doing it in typescript.
-}