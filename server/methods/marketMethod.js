Meteor.methods({
     // Market
    acceptOrder: function (opts) {
        var orderId = opts.orderId,
            amount = opts.amount,
            storage = getCorp().storage,
            order = MarketOrder.findOne(orderId);

        if (!_.has(storage, 1))
            storage[1] = {};

        if (!_.has(storage[1], order.itemId))
            storage[1][order.itemId] = { itemKey: order.itemId, amount: 0 };

        if (order.buyOrder) {
            if (storage[1][order.itemId].amount < order.amount)
                throw new Meteor.Error(413, "Not enough items");

            storage[1][order.itemId].amount -= order.amount;

            // TODO Remove money from owner, add to corp
        } else {

            // TODO check if have money, pay

            storage[1][order.itemId].amount += order.amount;
        }

        
        MarketOrder.update(order._id,
            { $set: {
                "status": 2,
                "acceptedBy": getCorp().name,
                "acceptedTime": new Date()
            }});

        Corporation.update(Meteor.user().corporation,
            { $set: { "storage": storage } });
    },
});