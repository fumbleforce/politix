
Meteor.publish( null, function() {
    return Meteor.users.find({}, {fields: {
        created: 1,
        createDate: 1,
        name: 1,
        treasury: 1,
        level: 1,
        mayor: 1,
        settlers: 1,
        storage: 1,
        buildings: 1,
        exploration: 1,
        army:1,
    }});
});


Meteor.methods({


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