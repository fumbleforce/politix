

Template.navList.page = function () {
    return Session.get("currentPage");
};

Template.navList.events({
    'click a': function (event) {
        var $el = $("."+event.target.hash.split("#")[1]);
        if ($el.css("left") == 'auto') {
            $el.css({
                "left": "50%",
                "top": "50%",
            });
        }
        Session.set("panelOrder", Session.get("panelOrder")+1);
        $el.css("z-index", Session.get("panelOrder")).toggle(100);
    }
});