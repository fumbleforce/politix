
asArray = function(obj) {
    var result = [];

    for (var key in obj) {
        var o = {};
        o["key"] = key;
        o["value"] = obj[key];
        result.push(o);
    }
    return result;
};
UI.registerHelper('asArray', asArray);




capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
UI.registerHelper('capitalize', capitalize);


formatDate = function() {
    return this.date.toLocaleString();
};
UI.registerHelper('formatDate', formatDate);


secDiff = function (from, to) {
    if (!to) {
        to = from;
        from = new Date();
    }
    return Math.abs((from).getTime() - to.getTime()) / 1000;
};


NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

