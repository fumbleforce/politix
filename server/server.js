
Meteor.publish( null, function() {
    return Meteor.users.find({}, {fields: {profile: 1, username: 1, corporation: 1 }})
});


