Template.Relations.helpers({

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