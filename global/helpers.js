

UI.registerHelper('asSortedArray', function(obj) {
    var result = [];
    for (var key in obj)
        result.push(obj[key]);
    return result;
});

UI.registerHelper('capitalize', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

