Template.company.company = function () {
    if (Meteor.user())
        return Companies.findOne(Meteor.user().company);
    return false;
};