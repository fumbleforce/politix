

UI.registerHelper('objToArray', function(obj) {
    var result = [];
    for (var key in obj)
        result.push({ key:key, value:obj[key] });
    return result;
});



NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

