

Template.production.factories = function () {
	return Factory.find({ corporation: Meteor.user().corporation });
};