
setOwnerName = function (options) {
    Meteor.call('setOwnerName', _.extend({}, options));
};

createCompany = function (options) {
    var id = Random.id();
    Meteor.call('createCompany', _.extend({ _id: id }, options));
    return id;
};

Meteor.methods({
    createCompany: function (options) {
        check(options, {
            name: NonEmptyString,
            _id: Match.Optional(NonEmptyString)
        });

        if (options.name.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        if (Companies.find({ name: options.name }).count())
            throw new Meteor.Error(400, "Company name exists");

        var id = options._id || Random.id();
        
        Companies.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000.0,
            employees: [],
            inventory: {}
        });

        if (Meteor.isServer) {
            console.log("adding company to user");
            Meteor.users.update(Meteor.user()._id,
                { $set: { "company": id } }
            );
        }
        return id;
    },

    setOwnerName: function (options) {
        check(options, {
            owner: NonEmptyString,
        });

        if (options.owner.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        Meteor.users.update(Meteor.user()._id,
            { $set: { "profile.name":options.owner } }
        );
        
        return options.owner;
    },
});
