
asArray = function(obj) {
    var result = [];
    for (var key in obj) {
        obj[key].key = key;
        result.push(obj[key]);
    }
    return result;
};
UI.registerHelper('asArray', asArray);




capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
UI.registerHelper('capitalize', capitalize);

getCorp = function () {
    return Corporation.findOne(Meteor.user().corporation);
};







NonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length !== 0;
});

