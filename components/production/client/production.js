

Template.production.factories = function () {
	return Factory.find({ corporation: Meteor.user().corporation });
};

Template.production.constructable = function () {
    return getStorageList().filter(function (i) {
        return getItem(i.itemKey).type == "buildings" && i.amount;
    });
};

Template.production.events({
    "click .construct": function (e) {
        var build = $(e.currentTarget).attr('building');
        Meteor.call("constructFactory", { itemId: build }, function (err, stuff) {
            console.log(err);
            console.log(stuff);
        });
    }
});