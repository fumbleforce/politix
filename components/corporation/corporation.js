
Corporation = {};

Corporation.get = function (corpId) {
    if (corpId) {
        return CorporationCollection.findOne(corpId);
    } else {
        return CorporationCollection.findOne(Meteor.user().corporation);
    }
};







if (Meteor.isClient) {


Template.Corporation.helpers({
    corporation: function () {
        if (Meteor.user())
            return CorporationCollection.findOne(Meteor.user().corporation);
        return false;
    },

    rendered: function () {
        $('.corporation nav').tab();
        /*
        $('.corporation nav a').click(function (e) {
            e.preventDefault();
        });
    */
    }
});

Template.Corporation.events({
    "click .save-corp-info": function (e) {
        CorporationCollection.update(getCorp()._id,
            { $set: { 
                description: $("textarea.description-edit").val(),
                motto: $("input.motto-edit").val()
        }});
    }
});




} else {


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

        if (CorporationCollection.find({ name: options.name }).count())
            throw new Meteor.Error(400, "Corporation name exists");

        var id = options._id || Random.id();
        
        CorporationCollection.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000.0,
            employees: [],
        });

        StorageCollection.insert({
            corporation: id,
            "Volantis": {}
        });

        Meteor.users.update(Meteor.user()._id,
            { $set: { "corporation": id } }
        );

        return id;
    }
});




}