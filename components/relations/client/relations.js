
var relationsDep = new Deps.Dependency();

Meteor.startup(function () {
    Session.set("relationsTerm", "");
    Session.set("relationsNoResults", true);
})

Template.Relations.helpers({
    searchResults: function () {
        relationsDep.depend();
        var term = Session.get("relationsTerm");
        if (term === "") {
            console.log("term is empty");
            return [];
        }
        var res = Meteor.users.find({
            $or: [
                { $where: "this.mayor.indexOf('"+term+"') != -1" },
                { $where: "this.name.indexOf('"+term+"') != -1" },
            ]});
        Session.set("relationsNoResults", res.count() === 0);
        return res;
    },

    noResults: function () {
        return Session.get("relationsNoResults");
    }
});

Template.Relations.events({
    'change input': function (e) {
        // template data, if any, is available in 'this'
        var term = $(e.target).val();
        if (term === "") {
            console.log("term is empty")
            return;
        }
        Session.set("relationsTerm", term);
        //relationsDep.changed();
    },

    "click .corporation-entry": function (e) {
        Session.set("selectedCorp", $(e.currentTarget).attr('corp'));
    }
});