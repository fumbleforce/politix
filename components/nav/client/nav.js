
if (Meteor.isClient) {

    Meteor.startup(function () {
        Session.set("currentPage", "town");
    });

    Template.NavList.page = function () {
        return Session.get("currentPage");
    };

    Template.NavList.events({
        'click a': function (e) {
            var page = $(e.target).closest("a").attr("ref");
            var $el = $("."+page);
            Router.go("/"+page);
        }
    });

}