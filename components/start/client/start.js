
Template.StartGame.helpers({
    error: function () {
        return Session.get("createError");
    }
})

Template.StartGame.events({
    'click .save': function (event, template) {
        var corporationName = template.find(".corporationName").value,
            owner = template.find(".owner").value;

        if (!corporationName.length)
            Session.set("createError", "The corporation needs a name");
        else if (!owner.length)
            Session.set("createError", "You need to specify a name");
        else {
            var id = createCorporation({ name: corporationName });
            setOwnerName({ owner: owner });
        }
    }

});