

Template.navList.page = function () {
    return Session.get("currentPage");
};

Template.navList.events({
    'click a': function (event) {
        var $el = $("."+event.target.hash.split("#")[1]);
        console.log($el.css('left'))
        if ($el.css('left') == 'auto')
            $el.css('left', Math.floor(Math.random()*$(window).width()) + "px")
        
        $el.toggle(100);
    }
});