Template.corporation.corporation = function () {
    if (Meteor.user())
        return Corporation.findOne(Meteor.user().corporation);
    return false;
};

Template.corporation.rendered = function () {
    $('.corporation nav').tab();
    /*
    $('.corporation nav a').click(function (e) {
        e.preventDefault();
    });
*/
};