Template.main.noUser = !Meteor.user();


Template.main.hasName = function () {
    if (Meteor.user().profile)
        return Meteor.user().profile.name;
    return false;
};
Template.main.noName = !Template.main.hasName();

Template.main.hasCompany = function () {
    if (Meteor.user())
        return Meteor.user().company;
    return false;
};
Template.main.noCompany = !Template.main.hasCompany();

Template.companyStatus.company = function () {
    if (Meteor.user())
        return Companies.findOne(Meteor.user().company);
    return false;
};

Template.main.rendered = function () {

    $(".main").height($(window).height());

    $.fn.drags = function(opt) {

        opt = $.extend({ handle:"", cursor:"move" }, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                targetX, targetY,
                w_width = $(window).width(),
                w_height = $(window).height(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;

            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                targetX = e.pageX + pos_x - drg_w;
                targetY = e.pageY + pos_y - drg_h,
                targetX = targetX < 0 ? 0 : targetX;
                targetY = targetY < 0 ? 0 : targetY;
                targetX = targetX > w_width - drg_w ? w_width - drg_w : targetX;
                targetY = targetY > w_height - drg_h ? w_height - drg_h : targetY;
                $('.draggable').offset({
                    top: targetY,
                    left: targetX
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
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
    }

    $(".drag-component").drags({ handle: ".panel-heading" });
};



