

Template.NavList.page = function () {
    return Session.get("currentPage");
};

Template.NavList.events({
    'click a': function (event) {
        $(".panel.component").hide();
        var $el = $("."+event.target.hash.split("#")[1]);
        Session.set("panelOrder", Session.get("panelOrder")+1);
        $el.css("z-index", Session.get("panelOrder")).toggle(0);
    }
});