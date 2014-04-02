Template.main.noUser = !Meteor.user();


Template.main.hasName = function () {
    if (Meteor.user().profile)
        return Meteor.user().profile.name;
    return false;
};
Template.main.noName = !Template.main.hasName();

Template.main.hasCompany = function () {
    if (Meteor.user())
        return Meteor.user().company;
    return false;
};
Template.main.noCompany = !Template.main.hasCompany();

Template.companyStatus.company = function () {
    if (Meteor.user())
        return Companies.findOne(Meteor.user().company);
    return false;
};

