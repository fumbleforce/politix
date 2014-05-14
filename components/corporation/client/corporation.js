Template.corporation.corporation = function () {
    if (Meteor.user())
        return Corporation.findOne(Meteor.user().corporation);
    return false;
};

Template.corporation.rendered = function () {
    $('.corporation nav').tab();
    /*
    $('.corporation nav a').click(function (e) {
        e.preventDefault();
    });
*/
};

Template.corporation.events({
    "click .save-corp-info": function (e) {
        Corporation.update(getCorp()._id,
            { $set: { 
                description: $("textarea.description-edit").val(),
                motto: $("input.motto-edit").val()
        }});
    }
});