


Template.startGame.events({
    'click .save': function (event, template) {
        var companyName = template.find(".companyName").value,
            owner = template.find(".owner").value;

        if (!companyName.length)
            Session.set("createError", "The company needs a name");
        else if (!owner.length)
            Session.set("createError", "You need to specify a name");
        else {
            var id = createCompany({ name: companyName });
            setOwnerName({ owner: owner });
        }
    }

});

Template.startGame.error = function () {
    return Session.get("createError");
};