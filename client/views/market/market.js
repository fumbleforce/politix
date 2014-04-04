


Template.market.items = function () {
    return sortedItems;
};

Template.market.item = function () {
	return getItem(Session.get("activeMarketItem"));
};



Template.market.events({
	"click .filter-list > li": function(event) {
		$(event.currentTarget).next(".sub-filter-list").toggle();
	},
	"click .sub-filter-list > li": function(event) {
		Session.set("activeMarketItem", $(event.currentTarget).attr('item'));
	}
});

if (Meteor.isClient) {
	Meteor.startup(function() {
		Session.set("activeMarketItem", { key: "hello" });
	});
}