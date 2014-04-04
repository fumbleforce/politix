Template.corporation.corporation = function () {
    if (Meteor.user())
        return Corporation.findOne(Meteor.user().corporation);
    return false;
};