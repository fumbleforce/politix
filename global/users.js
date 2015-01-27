User = {};

User.update = function (opts) {
    Meteor.users.update({ _id: Meteor.userId() }, opts);
};

User.exists = function () {
    return Meteor.user() != undefined && Meteor.user() != null  && Meteor.user().name != undefined;
};