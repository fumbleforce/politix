Meteor.methods({
    createCorporation: function (options) {
        check(options, {
            name: NonEmptyString,
            _id: Match.Optional(NonEmptyString)
        });

        if (options.name.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        if (Corporation.find({ name: options.name }).count())
            throw new Meteor.Error(400, "Corporation name exists");

        var id = options._id || Random.id();
        
        Corporation.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000.0,
            employees: [],
            storage: {}
        });

        if (Meteor.isServer) {
            console.log("adding corporation to user");
            Meteor.users.update(Meteor.user()._id,
                { $set: { "corporation": id } }
            );
        }
        return id;
    }
});