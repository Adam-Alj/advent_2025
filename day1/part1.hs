import Debug.Trace (trace)
-- Given instructions to move an index on a doubly linked, circular
-- list, return the number of times the index it 0 for those instructions

{-
match rotation amount
    for positive, take length + n then drop n
    for negativs, take length*2 + n then drop length + n
-}
-- Given a theoretically cyclic list, rotates it and return the new list.
-- The head of the returned list is the dial position
rotateDial :: [Int] -> Int -> [Int]
rotateDial dial rotationAmount
    | rotationAmount > 0 = drop rotationAmount (take (length dial + rotationAmount) (cycle dial)) 
    | otherwise = rotateDial dial (length dial - abs rotationAmount `mod` length dial)

getDialPositions :: [Int] -> [Int] -> [Int] -> [Int]
getDialPositions _ [] acc = acc
getDialPositions dial instructions acc =
    getDialPositions rotatedDial (tail instructions) (acc ++ [head rotatedDial])
    where rotatedDial = rotateDial dial (head instructions)

-- Returns the positive or negative int representation of the instruction
-- e.g. L18 = -18
parseInstruction :: String -> Int
parseInstruction s
    | direction == 'R' = read (tail s)
    | direction == 'L' = (-1) * read (tail s)
    where direction = head s


main :: IO Int
main = do
    instructions <- readFile "input.txt"
    let rotationAmounts = map parseInstruction (lines instructions)
    let dialPositions = getDialPositions (rotateDial [0..99] 50) rotationAmounts []
    let res = length (filter (==0) dialPositions)
    print dialPositions
    print res
    return (head dialPositions)