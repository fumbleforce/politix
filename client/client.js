Template.dashboard.noUser = !Meteor.user();


Template.dashboard.hasName = function () {
    if (Meteor.user() && Meteor.user().profile)
        return Meteor.user().profile.name;
    return false;
};
Template.dashboard.noName = function() { return !Template.dashboard.hasName(); };

Template.dashboard.hasCorporation = function () {
    if (Meteor.user())
        return Meteor.user().corporation;
    return false;
};
Template.dashboard.noCorporation = function() { return !Template.dashboard.hasCorporation(); };



Template.dashboard.rendered = function () {

    $(".main").height($(window).height());
};
    
Template.navList.rendered = function () {

    if (!this.rendered) {
        console.log("Adding dragging listener");
        $(".drag-component").drags({ handle: ".panel-heading" });

        this.rendered = true;
    }
};



Meteor.startup(addDragsFunc);


function addDragsFunc () {
    Session.set("panelOrder", 10);

    $.fn.drags = function(opt) {
        var $el, $drag,
            z_idx,drg_h,drg_w,targetX, targetY,
            w_width, w_height, pos_y, pos_x;

        opt = $.extend({ handle:"", cursor:"move" }, opt);

        if(opt.handle === "") {
            $el = this;
        } else {
            $el = this.find(opt.handle);
        }

        console.log(opt.handle + " should now be draggable");

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {

            Session.set("panelOrder", Session.get("panelOrder")+1);

            if(opt.handle === "") {
                $drag = $(this).addClass('draggable');
            } else {
                $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }

            z_idx = $drag.css('z-index');
            drg_h = $drag.outerHeight();
            drg_w = $drag.outerWidth();
            w_width = $(window).width();
            w_height = $(window).height();
            pos_y = $drag.offset().top + drg_h - e.pageY;
            pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                targetX = e.pageX + pos_x - drg_w;
                targetY = e.pageY + pos_y - drg_h;
                targetX = targetX < 0 ? 0 : targetX;
                targetY = targetY < 0 ? 0 : targetY;
                targetX = targetX > w_width - drg_w ? w_width - drg_w : targetX;
                targetY = targetY > w_height - drg_h ? w_height - drg_h : targetY;
                $('.draggable').offset({
                    top: targetY,
                    left: targetX
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', Session.get("panelOrder"));
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
                $(this).parents().unbind('mousemove');
            }
        });
    };
}