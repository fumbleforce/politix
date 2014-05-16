
if (Meteor.isClient) {

    // Market

    Template.market.items = function () {
        return itemHierarchy;
    };

    Template.market.item = function () {
        return getItem(Session.get("activeMarketItem"));
    };

    Template.market.buyOrders = function () {
        // TODO Sort by location

        return MarketOrder.find({
            itemId: +Session.get("activeMarketItem"),
            buyOrder: true,
            status: 1
        });
    };

    Template.market.sellOrders = function () {
        // TODO Sort by location
        
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
            Session.set("panelOrder", Session.get("panelOrder")+1);
            $('.market-order-dialog').css({
                "left": "50%",
                "z-index": Session.get("panelOrder")
            }).show();
        },
        "click button.buy": function (event) {
            createBuyOrder($(event.target));
        }
    });



    Meteor.startup(function() {
        //Session.set("activeMarketItem", { key: "hello" });
    });



    // Market dialog


    Template.marketDialog.order = function () {
        console.log("finding order "+Session.get("selectedMarketOrder"));
        return MarketOrder.findOne(Session.get("selectedMarketOrder"));
    };

    Template.marketDialog.totalPrice = function () {
        var o = MarketOrder.findOne(Session.get("selectedMarketOrder"));
        // Todo add tax and transaction cost
        return o.quantity * o.price;
    };

    Template.marketDialog.events({
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

    Template.marketCreateOrder.order = function () {
        return Session.get("createMarketOrder");
    };

    var totalPriceDep = new Deps.Dependency();

    Template.marketCreateOrder.totalPrice = function () {
        var o = Session.get("createMarketOrder"),
            $createOrder = $('.market-create-order-dialog'),
            quantity = ~~$createOrder.find("input[name='orderQuantity']").val(),
            price = +$createOrder.find("input[name='orderPrice']").val();

        totalPriceDep.depend();

        return (price * quantity).toFixed(2);
    };

    Template.marketCreateOrder.events({
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




    Meteor.methods({

        acceptOrder: function (opts) {

            var orderId = opts.orderId,
                quantity = opts.quantity,
                storage = getStorage(),
                corp = getCorp(),
                order = MarketOrder.findOne(orderId),
                item = getItem(order.itemId),
                cashDelta = order.quantity * order.price;


            if (!_.has(storage, "Volantis"))
                storage["Volantis"] = {};

            storage = storage["Volantis"];

            if (!_.has(storage, order.itemId))
                storage[order.itemId] = { itemKey: order.itemId, amount: 0 };

            if (order.buyOrder) {
                if (storage[order.itemId].amount < order.quantity)
                    throw new Meteor.Error(413, "Not enough items");

                storage[order.itemId].amount -= order.quantity;
                corp.cash += cashDelta;

                Transaction.insert({
                    description: "Purchase of "+item.name,
                    time: new Date(),
                    receiver: { name: getCorp().name, id: getCorp()._id },
                    sender: order.owner,
                    amount: cashDelta,
                    type: "market"
                });

                // TODO Remove money from owner, add to corp
            } else {

                // TODO check if have money, pay

                if (corp.cash >= cashDelta) {
                    storage[order.itemId].amount += order.quantity;
                    corp.cash -= cashDelta;

                } else {
                    console.log("Have "+corp.cash+" need "+cashDelta);
                    throw new Meteor.Error(413, "Not enough cash");
                }

                Transaction.insert({
                    description: "Purchase of "+item.name,
                    time: new Date(),
                    sender: { name: getCorp().name, id: getCorp()._id },
                    receiver: order.owner,
                    amount: cashDelta,
                    type: "market"
                });
            }

            Corporation.update(Meteor.user().corporation,
                { $set: { "cash": corp.cash } });

            MarketOrder.update(order._id,
                { $set: {
                    "status": 2,
                    "acceptedBy": { name: getCorp().name, id: getCorp()._id },
                    "acceptedTime": new Date()
                }});

            Storage.update({ corporation: Meteor.user().corporation },
                { $set: { "Volantis": storage } });

            Deps.flush();
        },



        createOrder: function (opts) {
            console.log("Creating order..")
            var itemId = opts.itemId,
                quantity = opts.quantity,
                price = opts.price,
                type = opts.type,
                buyOrder = type === "buy"
                storage = getStorage(),
                corp = getCorp(),
                item = getItem(opts.itemId),
                totalPrice = quantity * price;


            if (!_.has(storage, "Volantis"))
                storage["Volantis"] = {};

            storage = storage["Volantis"];

            if (!_.has(storage, itemId))
                storage[itemId] = { itemKey: itemId, amount: 0 };


            if (buyOrder) {

                // TODO Escrow
                if (corp.cash < totalPrice)
                    throw new Meteor.Error(413, "Not enough cash");

            } else {

                if (storage[itemId].amount < quantity)
                    throw new Meteor.Error(413, "Not enough items to sell");

                storage[itemId].amount -= quantity;

                Storage.update({ corporation: Meteor.user().corporation },
                    { $set: { "Volantis": storage } });

            }

            var order = {
                owner: { name: corp.name, id: corp._id },
                itemId: itemId,
                price: price,
                quantity: quantity,
                buyOrder: buyOrder,
                status: 1
            };

            console.log(order);

            MarketOrder.insert(order);
        }
    });
}