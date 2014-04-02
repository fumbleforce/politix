

Template.navList.page = function () {
    return Session.get("currentPage");
};

Template.navList.events({
    'click a': function (event) {
        Session.set("currentPage", event.target.hash.split("#")[1]);
    }
});