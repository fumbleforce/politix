
Meteor.publish( null, function() {
    return Meteor.users.find({}, {fields: {profile: 1, username: 1, corporation: 1 }})
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