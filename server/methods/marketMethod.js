Meteor.methods({

    acceptOrder: function (opts) {
        var orderId = opts.orderId,
            amount = opts.amount,
            storage = getStorage(),
            corp = getCorp(),
            order = MarketOrder.findOne(orderId);

        if (!_.has(storage, "Volantis"))
            storage["Volantis"] = {};

        storage = storage["Volantis"];

        if (!_.has(storage, order.itemId))
            storage[order.itemId] = { itemKey: order.itemId, amount: 0 };

        if (order.buyOrder) {
            if (storage[order.itemId].amount < order.amount)
                throw new Meteor.Error(413, "Not enough items");

            storage[order.itemId].amount -= order.amount;
            corp.cash += order.amount * order.price;

            // TODO Remove money from owner, add to corp
        } else {

            // TODO check if have money, pay

            if (corp.cash >= order.amount * order.price) {
                storage[order.itemId].amount += order.amount;
                corp.cash -= order.amount * order.price;

            } else {
                console.log("Have "+corp.cash+" need "+order.amount * order.price);
                throw new Meteor.Error(413, "Not enough cash");
            }

            
        }

        Corporation.update(Meteor.user().corporation,
            { $set: { "cash": corp.cash } });

        MarketOrder.update(order._id,
            { $set: {
                "status": 2,
                "acceptedBy": corp.name,
                "acceptedTime": new Date()
            }});

        Storage.update({ corporation: Meteor.user().corporation },
            { $set: { "Volantis": storage } });

        Deps.flush();
    },
});