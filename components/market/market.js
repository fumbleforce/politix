
if (Meteor.isClient) {

    // Market

    Template.Trade.helpers({
        items: function () {
            return Item.byCategory;
        },

        item: function () {
            return Item.get(Session.get("activeMarketItem"));
        },

    });


    Template.Trade.events({
        "click .buy": function (e) {
            var $el = $(e.target).closest(".item"),
                qty = +$el.find(".amount").val(),
                item = $el.attr("itemid");
            console.log("qty:", qty);
            console.log("item", item);
            Meteor.call("TradeVendorBuy", { id: item, qty: qty }, Error.handler);
        },

        "click .sell": function (e) {
            var $el = $(e.target).closest(".item"),
                qty = +$el.find(".amount").val(),
                item = $el.attr("itemid");
            console.log("qty:", qty);
            console.log("item", item);
            Meteor.call("TradeVendorSell", { id: item, qty: qty }, Error.handler);
        }
    });



    Meteor.startup(function() {

    });



    // Market dialog


    Template.MarketDialog.helpers({

    });

    Template.MarketDialog.events({
        "click .cancel": function(event) {
            $('.market-order-dialog').hide();
        },
        "click .accept": function(event) {
            $('.market-order-dialog').hide();
            var orderId = Session.get("selectedMarketOrder"),
                quantity = $('.market-order-dialog').find("input .orderAmount").val();
            
            Meteor.call('acceptOrder', { orderId: orderId, quantity: quantity }, Error.handler);
            Event.addEvent("Accepted order "+orderId);
        },
    });




    // Order creation

    Template.MarketCreateOrder.helpers({
        order: function () {
            return Session.get("createMarketOrder");
        },
        
        totalPrice: function () {
            var o = Session.get("createMarketOrder"),
                $createOrder = $('.market-create-order-dialog'),
                quantity = ~~$createOrder.find("input[name='orderQuantity']").val(),
                price = +$createOrder.find("input[name='orderPrice']").val();

            totalPriceDep.depend();

            return (price * quantity).toFixed(2);
        }
    })

    var totalPriceDep = new Deps.Dependency();


    Template.MarketCreateOrder.events({
        "click .cancel": function(event) {
            $('.market-create-order-dialog').hide();
        },
        "click .create": function(event) {
            var $createOrder = $('.market-create-order-dialog'),
                order = Session.get("createMarketOrder");
            
            $createOrder.hide();
            
            order.quantity = ~~$createOrder.find("input[name='orderQuantity']").val();
            order.type = $createOrder.find("input[name='orderType']:checked").val();
            order.price = +$createOrder.find("input[name='orderPrice']").val();

            Meteor.call('createOrder', order, Error.handler);

            Event.addEvent("Created order");
        },
        "change input[name='orderQuantity']": function () {
            totalPriceDep.changed();
        },
        "change input[name='orderPrice']": function () {
            totalPriceDep.changed();
        },

    });

    


} else {

    Meteor.startup(function () {

    });



    Meteor.methods({

        TradeVendorBuy: function (opts) {
            var id = opts.id,
                qty = +opts.qty,
                item = Item.get(id);

            if (Town.get().treasury < item.sellPrice * qty)
                throw new Meteor.Error("Not enough money in treasury");

            Meteor.call("TreasurySpend", {
                desc: "Bought "+ qty + " of " + item.name + " for " + (item.sellPrice * qty),
                amount: item.sellPrice * qty
            });

            Meteor.call("StorageAdd", { id: id, qty: qty });

            Event.addEvent("Bought "+ qty + " of " + item.name + " for " + (item.sellPrice * qty))
        },

        TradeVendorSell: function (opts) {
            var id = opts.id,
                qty = +opts.qty,
                item = Item.get(id);

            if (!Storage.hasItem(id, qty))
                throw new Meteor.Error("Not enough "+item.name);

            Meteor.call("StorageSpendMultiple", [{ id: id, qty: qty }]);
            
            Meteor.call("TreasuryEarn", {
                desc: "Sold "+ qty + " of " + item.name + " for " + (item.buyPrice * qty),
                amount: item.buyPrice * qty
            });

            Event.addEvent("Sold "+ qty + " of " + item.name + " for " + (item.buyPrice * qty))
        },

        transactionData: function (opts) {
            var itemId = opts.itemId;

            var transactions = TransactionCollection.find({
                type: "market",
                itemId: itemId,
            }).sort({ time: 1 }),

            data = transactions.map(function(t){
                t.price = t.amount/t.quantity;
                return t;
            });

            return transactions;
        },

        marketData: function (opts) {
            console.log("Finding reports for item ", opts.itemId);
            var reports = MarketReportCollection.find({ itemId: +opts.itemId }).fetch(),
                price = [
                    reports.map(function(r, i) { return i; }),
                    reports.map(function(r) { return r.sellAvg; }),
                ],
                quantity = [
                    reports.map(function(r, i) { return i; }),
                    reports.map(function(r) { return r.movement; }),
                ];
            console.log("consolidating data");
            var data = {
                price: price,
                quantity: quantity,
                summaryTicks: reports
            };
            console.log("Returning data");
            return data;
        }
    });





}


Market = {};

/*
Market.marketGraph = function(container, marketData) {
    $(container).empty();
    container = $(container)[0];

    var
    summaryTicks = marketData.summaryTicks,
    options = {
    container : container,
    data : {
      price : marketData.price,
      volume : marketData.quantity,
      summary : marketData.price
    },
    trackFormatter : function (o) {

      var
        data = o.series.data,
        index = data[o.index][0],
        value;

      value = summaryTicks[index].date + ': $' + summaryTicks[index].sellAvg + ", Vol: " + summaryTicks[index].movement;

      return value;
    },
    xTickFormatter : function (index) {
      var date = marketData.summaryTicks[index].date;
      return date.getDate() + '';
    },
    // An initial selection
    selection : {
      data : {
        x : {
          min : 100,
          max : 200
        }
      }
    }
  };

  return new envision.templates.Finance(options);
};


Market.createOrder = function($el, itemId, quantity) {

    itemId = itemId || +$el.attr("itemId");
    quantity = quantity || +$el.attr("quantity");
    
    var $createOrder = $('.market-create-order-dialog');

    $createOrder.find("[name=\"orderQuantity\"]").val(quantity);

    Session.set("createMarketOrder", {
        item: Item.get(itemId),
        itemId: itemId
    });

    Session.set("panelOrder", Session.get("panelOrder") + 1);

    totalPriceDep.changed();
    
    $createOrder.css({
        "left": "50%",
        "z-index": Session.get("panelOrder")
    }).show();
};

Market.createSellOrder = function ($el) {
    $('.market-create-order-dialog').find("[name=\"orderType\"][value=\"sell\"]").prop("checked", true);
    Market.createOrder($el);
};


Market.createBuyOrder = function ($el) {
    $('.market-create-order-dialog').find("[name=\"orderType\"][value=\"buy\"]").prop("checked", true);
    Market.createOrder($el);
};


Market.generateHourlyMarketReport = function () {
    console.log("Generating market report");
    _.each(Item.items, function (i) {
        var id = i.key,
            hourAgo = (new Date()).setHours((new Date()).getHours() - 2),
            activeOrders = MarketOrderCollection.find({
                itemId: id,
                status: 1
            }).fetch(),
            completedOrders = MarketOrderCollection.find({
                itemId: id,
                status: 2,
                date: { $gte: hourAgo }
            }).fetch(),
            orders = activeOrders.concat(completedOrders),
            sellOrders = orders.filter(function (o) { return !o.buyOrder; }),
            buyOrders = orders.filter(function (o) { return o.buyOrder; }),
            activeSellOrders = activeOrders.filter(function (o) { return !o.buyOrder; }),
            activeBuyOrders = activeOrders.filter(function (o) { return o.buyOrder; }),
            completedSellOrders = completedOrders.filter(function (o) { return !o.buyOrder; }),
            completedBuyOrders = completedOrders.filter(function (o) { return o.buyOrder; });


        var orderQuantitySum = function(a, b) { return a + b.quantity; },
            orderMin = function (a, b) { return a < b.price ? a : b.price; },
            orderMax = function (a, b) { return a > b.price ? a : b.price; },
            orderSum = function (a, b) { return +a + (+b.price); };


        MarketReportCollection.insert({
            type: "hourly",
            date: new Date(),
            itemId: id,
            sellHigh: sellOrders.reduce(orderMax,0),
            sellLow: sellOrders.reduce(orderMin,Infinity),
            sellAvg: sellOrders.reduce(orderSum,0)/sellOrders.length,
            buyHigh: buyOrders.reduce(orderMax,0),
            buyLow: buyOrders.reduce(orderMin,Infinity),
            buyAvg: buyOrders.reduce(orderSum,0)/buyOrders.length,
            demand: buyOrders.reduce(orderQuantitySum,0),
            supply: sellOrders.reduce(orderQuantitySum,0),
            movement: completedBuyOrders.reduce(orderQuantitySum,0) + completedSellOrders.reduce(orderQuantitySum,0),
            sold: completedSellOrders.reduce(orderQuantitySum,0),
            bought: completedBuyOrders.reduce(orderQuantitySum,0),
        });

    });
};


Market.generateDailyMarketReport = function () {
    console.log("Generating daily market report");

    // TODO, combine the day's hourly reports
};

Market.resupplyGovernmentContracts = function () {
    console.log("Resupplying government contracts");

    var government = CorporationCollection.findOne({ name: "The Government" });

    _.each(Item.items, function (i) {
        var sellOrders = MarketOrderCollection.find({ buyOrder: false, itemId: i.key, "owner.id": government._id, status: 1 }),
            buyOrders = MarketOrderCollection.find({ buyOrder: true, itemId: i.key, "owner.id": government._id, status: 1 });

        if (sellOrders.count() < 10) {
            for (var o = 0; o < 10 - sellOrders.count(); o++) {
                MarketOrderCollection.insert({
                    itemId: i.key,
                    owner: { name: government.name, id: government._id },
                    buyOrder: false,
                    price: (Math.random() * 100 + 50).toFixed(2),
                    quantity: Math.floor(Math.random() * 5)+1,
                    location: 1,
                    status: 1
                });
            }
        }

        if (buyOrders.count() < 10) {
            for (var o = 0; o < 10 - buyOrders.count(); o++) {
                MarketOrderCollection.insert({
                    itemId: i.key,
                    owner:  { name: government.name, id: government._id },
                    buyOrder: true,
                    price: (Math.random() * 10 + 5).toFixed(2),
                    quantity: Math.floor(Math.random() * 5)+1,
                    location: 1,
                    status: 1
                });
            }
        }

    });
};

*/