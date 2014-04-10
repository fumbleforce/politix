

Template.navList.page = function () {
    return Session.get("currentPage");
};

Template.navList.events({
    'click a': function (event) {
        var $el = $("."+event.target.hash.split("#")[1]);
        if ($el.css('left') == 'auto') {
            $el.css('left', "50%");
            $el.css('top', "50%");
        }
        $el.toggle(100);
    }
});