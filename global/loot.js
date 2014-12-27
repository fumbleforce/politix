

randLoot = function (probas, loots) {
    var ar = [];
    var i,sum = 0;

    // that following initialization loop could be done only once above that
    // randexec() function, we let it here for clarity
    for (i=0 ; i<probas.length-1 ; i++) {
        sum += (probas[i] / 100.0);
        ar[i] = sum;
    }

    // Then we get a random number and finds where it sits inside the probabilities 
    // defined earlier
    var r = Math.random(); // returns [0,1]

    for (i=0 ; i<ar.length && r>=ar[i] ; i++) ;

    // Finally execute the function and return its result
    return loots[i];
};