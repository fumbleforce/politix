


Template.market.items = function () {
    return itemHierarchy;
};

Template.market.item = function () {
	return getItem(Session.get("activeMarketItem"));
};

Template.market.buyOrders = function () {
	// TODO Sort by location
	console.log("buy orders");
	return MarketOrder.find({
		itemId: +Session.get("activeMarketItem"),
		buyOrder: true,
		status: 1
	});
};

Template.market.sellOrders = function () {
	// TODO Sort by location
	console.log("sell orders");
	return MarketOrder.find({
		itemId: +Session.get("activeMarketItem"),
		buyOrder: false,
		status: 1
	});
};


Template.market.events({
	"click .filter-list > li": function(event) {
		$(event.currentTarget).next(".sub-filter-list").toggle();
	},
	"click .sub-filter-list > li": function(event) {
		Session.set("activeMarketItem", $(event.currentTarget).attr('item'));
	},
	"click .order": function(event) {
		Session.set("selectedMarketOrder", $(event.currentTarget).attr('order'));
		$('.market-order-dialog').css("left", "50%").show();
	},
});

if (Meteor.isClient) {
	Meteor.startup(function() {
		//Session.set("activeMarketItem", { key: "hello" });
	});
}



Template.marketDialog.order = function () {
	console.log("finding order "+Session.get("selectedMarketOrder"));
	return MarketOrder.findOne(Session.get("selectedMarketOrder"));
};

Template.marketDialog.totalPrice = function () {
	var o = MarketOrder.findOne(Session.get("selectedMarketOrder"));
	// Todo add tax and transaction cost
	return o.amount * o.price;
};

Template.marketDialog.events({
	"click .cancel": function(event) {
		$('.market-order-dialog').hide();
	},
	"click .accept": function(event) {
		$('.market-order-dialog').hide();
		var orderId = Session.get("selectedMarketOrder"),
			amount = $('.market-order-dialog').find("input .orderAmount").val();
		
		acceptOrder({ orderId: orderId, amount: amount });
	},
});