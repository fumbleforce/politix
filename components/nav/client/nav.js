
if (Meteor.isClient) {

    Meteor.startup(function () {
        Session.set("currentPage", "town");
    });

    Template.NavList.page = function () {
        return Session.get("currentPage");
    };

    Template.NavList.events({
        'click a': function (e) {
            $(".panel.component").hide();
            var page = $(e.target).closest("a").attr("href").split("#")[1];
            var $el = $("."+page);

            if (page != Session.get("currentPage")) {
                $(".bg-img-"+page).css({ "z-index": -2, "opacity": 1 });
                $(".bg-blur.active").animate({"opacity": 0}, 200).addClass("old").removeClass("active");
                $(".bg-img-"+page).addClass("active");
                Meteor.setTimeout(function () {
                    $(".bg-img-"+page).css("z-index", -1);
                    $(".bg-blur.old").css("z-index", -5).removeClass("old");
                }, 200);
            }


            Session.set("currentPage", page);
            Session.set("panelOrder", Session.get("panelOrder")+1);
            $el.css("z-index", Session.get("panelOrder")).toggle(0);
        }
    });

}