

Template.production.factories = function () {
	return Factory.find({ corporation: Meteor.user().corporation });
};

Template.production.constructable = function () {
    return getStorage().filter(function (i) {
        return getItem(i.itemKey).type == "buildings"
    });
};