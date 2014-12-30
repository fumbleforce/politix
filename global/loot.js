// Probabilities for each danger level
var questRewardProbability = [
    [80, 10, 0, 1, 0, 0, 0],
    [50, 20, 0, 5, 2, 0, 0],
    [20, 30, 0, 30, 5, 1, 0],
    [5, 10, 0, 20, 10, 5, 1],
    [1, 5, 0, 40, 20, 10, 5],
    [0, 1, 0, 20, 40, 20, 10],
    [0, 0, 0, 10, 40, 30, 20]
]
var lootLevels = [0, 1, 2, 3, 4, 5, 6];

randLootLevel = function (danger) {
    var probas = questRewardProbability[danger];
    var loots = lootLevels;
    var ar = [];
    var i,sum = 0;
    console.log(probas)
    // that following initialization loop could be done only once above that
    // randexec() function, we let it here for clarity
    for (i=0 ; i<probas.length-1 ; i++) {
        sum += (probas[i] / 100.0);
        ar[i] = sum;
    }
    console.log(ar)

    // Then we get a random number and finds where it sits inside the probabilities 
    // defined earlier
    var r = Math.random(); // returns [0,1]
    console.log(r)
    for (i=0 ; i<ar.length+1 && r>=ar[i] ; i++) ;
    console.log(i)
    if (i === ar.length) return -1
    // Finally execute the function and return its result
    return loots[i];
};