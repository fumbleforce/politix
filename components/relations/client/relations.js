Template.Relations.helpers({
    Corporation: function () {
        return Corporation.find();
    },

    selectedCorp: function () {
        return Corporation.findOne(Session.get("selectedCorp"));
    }
});

Template.Relations.events({
    'click input': function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
            console.log("You pressed the button");
    },

    "click .corporation-entry": function (e) {
        Session.set("selectedCorp", $(e.currentTarget).attr('corp'));
    }
});