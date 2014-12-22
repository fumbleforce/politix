
if (Meteor.isClient) {

    // Market

    Template.Market.helpers({
        items: function () {
            return itemHierarchy;
        },

        item: function () {
            return getItem(Session.get("activeMarketItem"));
        },

        buyOrders: function () {
            // TODO Sort by location

            return MarketOrder.find({
                itemId: +Session.get("activeMarketItem"),
                buyOrder: true,
                status: 1
            });
        },

        sellOrders: function () {
            // TODO Sort by location
            
            return MarketOrder.find({
                itemId: +Session.get("activeMarketItem"),
                buyOrder: false,
                status: 1
            });
        },

        viewAsTable: function () {
            return Session.get("marketAsTable");
        }
    });


    Template.Market.events({
        "click .filter-list > li": function(event) {
            $(event.currentTarget).next(".sub-filter-list").toggle();
        },
        "click .sub-filter-list > li": function(event) {
            Session.set("activeMarketItem", $(event.currentTarget).attr('item'));
            if (!Session.get("marketAsTable")) {
                console.log("Calling market data");
                Meteor.call("marketData", { itemId: Session.get("activeMarketItem") }, function (err, data) {
                    marketGraph(".market-graph", data);
                });
                
            }
        },
        "click .order": function(event) {
            Session.set("selectedMarketOrder", $(event.currentTarget).attr('order'));
            Session.set("panelOrder", Session.get("panelOrder")+1);
            $('.market-order-dialog').css({
                "left": "50%",
                "z-index": Session.get("panelOrder")
            }).show();
        },
        "click button.buy": function (event) {
            createBuyOrder($(event.target));
        },
        "click .view-type": function(e) {
            var isTable = $(e.target).attr("type") === "table";
            Session.set("marketAsTable", isTable);

            if (!isTable) {
                console.log("Calling market data");
                Meteor.call("marketData", { itemId: Session.get("activeMarketItem") }, function (err, data) {
                    marketGraph(".market-graph", data);
                });
                
            }

        }
    });



    Meteor.startup(function() {
        Session.set("marketAsTable", true);
    });



    // Market dialog


    Template.MarketDialog.helpers({
        order: function () {
            console.log("finding order "+Session.get("selectedMarketOrder"));
            return MarketOrder.findOne(Session.get("selectedMarketOrder"));
        },

        totalPrice: function () {
            var o = MarketOrder.findOne(Session.get("selectedMarketOrder"));
            // Todo add tax and transaction cost
            return o.quantity * o.price;
        }
    });

    Template.MarketDialog.events({
        "click .cancel": function(event) {
            $('.market-order-dialog').hide();
        },
        "click .accept": function(event) {
            $('.market-order-dialog').hide();
            var orderId = Session.get("selectedMarketOrder"),
                quantity = $('.market-order-dialog').find("input .orderAmount").val();
            
            Meteor.call('acceptOrder', { orderId: orderId, quantity: quantity }, function(err) {
                if (err) {
                    informUser(err.message);
                    addEvent(err.message);
                }
            });
            addEvent("Accepted order "+orderId);
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

            Meteor.call('createOrder', order, function(err) {
                if (err) {
                    informUser(err.message);
                    addEvent(err.message);
                }
            });

            addEvent("Created order");
        },
        "change input[name='orderQuantity']": function () {
            totalPriceDep.changed();
        },
        "change input[name='orderPrice']": function () {
            totalPriceDep.changed();
        },

    });

    var createOrder = function($el, itemId, quantity) {

        itemId = itemId || +$el.attr("itemId");
        quantity = quantity || +$el.attr("quantity");
        
        var $createOrder = $('.market-create-order-dialog');

        $createOrder.find("[name=\"orderQuantity\"]").val(quantity);

        Session.set("createMarketOrder", {
            item: getItem(itemId),
            itemId: itemId
        });

        Session.set("panelOrder", Session.get("panelOrder") + 1);

        totalPriceDep.changed();
        
        $createOrder.css({
            "left": "50%",
            "z-index": Session.get("panelOrder")
        }).show();
    };

    createSellOrder = function ($el) {
        $('.market-create-order-dialog').find("[name=\"orderType\"][value=\"sell\"]").prop("checked", true);
        createOrder($el);
    };


    createBuyOrder = function ($el) {
        $('.market-create-order-dialog').find("[name=\"orderType\"][value=\"buy\"]").prop("checked", true);
        createOrder($el);
    };


} else {

    Meteor.startup(function () {
        generateDailyMarketReport();
        generateHourlyMarketReport();
        //Meteor.setInterval(generateHourlyMarketReport, 60 * 1000);
        Meteor.setInterval(function () {
            console.log("Re-generating government conracts to test reports");
            MarketOrder.remove({});
            resupplyGovernmentContracts();
            generateHourlyMarketReport();
        }, 5 * 60 * 1000);
        Meteor.setInterval(generateDailyMarketReport, 24 * 60 * 60 * 1000);
    });



    Meteor.methods({

        acceptOrder: function (opts) {

            var orderId = opts.orderId,
                quantity = opts.quantity,
                storage = getStorage(),
                corp = getCorp(),
                order = MarketOrder.findOne(orderId),
                item = getItem(order.itemId),
                cashDelta = order.quantity * order.price;


            if (order.buyOrder) {
                if (storageCount(order.itemId) < order.quantity)
                    throw new Meteor.Error(413, "Not enough items");

                Meteor.call("removeItems", {
                    item: order.itemId,
                    amount: order.quantity
                });

                spend({
                    description: "Sold "+item.name,
                    time: new Date(),
                    receiver: { name: getCorp().name, id: getCorp()._id },
                    sender: order.owner,
                    amount: cashDelta,
                    itemId: order.itemId,
                    quantity: order.quantity,
                    type: "market"
                });

                // TODO Remove money from owner, add to corp
            } else {

                // TODO check if have money, pay

                if (corp.cash >= cashDelta) {

                    Meteor.call("addItems", {
                        item: order.itemId,
                        amount: order.quantity
                    });

                } else {
                    console.log("Have "+corp.cash+" need "+cashDelta);
                    throw new Meteor.Error(413, "Not enough cash");
                }

                spend({
                    description: "Bought "+item.name,
                    sender: { name: getCorp().name, id: getCorp()._id },
                    receiver: order.owner,
                    amount: -cashDelta,
                    itemId: order.itemId,
                    quantity: order.quantity,
                    type: "market"
                });
            }

            MarketOrder.update(order._id,
                { $set: {
                    "status": 2,
                    "acceptedBy": { name: getCorp().name, id: getCorp()._id },
                    "acceptedTime": new Date()
                }});

            Deps.flush();
        },



        createOrder: function (opts) {
            console.log("Creating order..");
            var itemId = opts.itemId,
                quantity = opts.quantity,
                price = opts.price,
                type = opts.type,
                buyOrder = type === "buy",
                storage = getStorage(),
                corp = getCorp(),
                item = getItem(opts.itemId),
                totalPrice = quantity * price;


            if (buyOrder) {

                // TODO Escrow
                if (corp.cash < totalPrice)
                    throw new Meteor.Error(413, "Not enough cash");

            } else {

                if (storage[itemId].amount < quantity)
                    throw new Meteor.Error(413, "Not enough items to sell");

                Meteor.call("removeItems", { item: itemId, amount: quantity });
            }

            var order = {
                owner: { name: corp.name, id: corp._id },
                itemId: itemId,
                price: price,
                quantity: quantity,
                buyOrder: buyOrder,
                status: 1
            };

            MarketOrder.insert(order);
        },



        transactionData: function (opts) {
            var itemId = opts.itemId;

            var transactions = Transaction.find({
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
            var reports = MarketReport.find({ itemId: +opts.itemId }).fetch(),
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



    resupplyGovernmentContracts = function () {
        console.log("Resupplying government contracts");

        var government = Corporation.findOne({ name: "The Government" });

        _.each(items, function (i) {
            var sellOrders = MarketOrder.find({ buyOrder: false, itemId: i.key, "owner.id": government._id, status: 1 }),
                buyOrders = MarketOrder.find({ buyOrder: true, itemId: i.key, "owner.id": government._id, status: 1 });

            if (sellOrders.count() < 10) {
                for (var o = 0; o < 10 - sellOrders.count(); o++) {
                    MarketOrder.insert({
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
                    MarketOrder.insert({
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

}




marketGraph = function(container, marketData) {
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




function generateHourlyMarketReport () {
    console.log("Generating market report");
    _.each(items, function (i) {
        var id = i.key,
            hourAgo = (new Date()).setHours((new Date()).getHours() - 2),
            activeOrders = MarketOrder.find({
                itemId: id,
                status: 1
            }).fetch(),
            completedOrders = MarketOrder.find({
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


        MarketReport.insert({
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
}

function generateDailyMarketReport () {
    console.log("Generating daily market report");

    // TODO, combine the day's hourly reports
}