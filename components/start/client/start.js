
Template.StartGame.helpers({
    error: function () {
        return Session.get("createError");
    }
})

Template.StartGame.events({
    'click .save': function (event, template) {
        var townName = template.find(".townName").value,
            mayor = template.find(".mayor").value
            focus = template.find(".focus :selected").value;
        console.log("Focus: ", focus)
        if (!townName.length)
            Session.set("createError", "The town needs a name");
        else if (!mayor.length)
            Session.set("createError", "You need to specify a name");
        else {
            Meteor.call("createTown", { name: townName, focus:focus, mayor: mayor });
        }
    }

});