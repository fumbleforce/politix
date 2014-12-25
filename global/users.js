User = {};

User.update = function (opts) {
    Meteor.users.update({ _id: Meteor.userId() }, opts);
};