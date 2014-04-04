
setOwnerName = function (options) {
    Meteor.call('setOwnerName', _.extend({}, options));
};

createCorporation = function (options) {
    var id = Random.id();
    Meteor.call('createCorporation', _.extend({ _id: id }, options));
    return id;
};

acceptOrder = function (options) { Meteor.call('acceptOrder', options); };

Meteor.methods({
    createCorporation: function (options) {
        check(options, {
            name: NonEmptyString,
            _id: Match.Optional(NonEmptyString)
        });

        if (options.name.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        if (Corporation.find({ name: options.name }).count())
            throw new Meteor.Error(400, "Corporation name exists");

        var id = options._id || Random.id();
        
        Corporation.insert({
            _id: id,
            owner: this.userId,
            name: options.name,
            cash: 10000.0,
            employees: [],
            storage: {}
        });

        if (Meteor.isServer) {
            console.log("adding corporation to user");
            Meteor.users.update(Meteor.user()._id,
                { $set: { "corporation": id } }
            );
        }
        return id;
    },

    setOwnerName: function (options) {
        check(options, {
            owner: NonEmptyString,
        });

        if (options.owner.length > 100)
            throw new Meteor.Error(413, "Name too long");

        if (!this.userId)
            throw new Meteor.Error(401, "Must be logged in");

        Meteor.users.update(Meteor.user()._id,
            { $set: { "profile.name":options.owner } }
        );
        
        return options.owner;
    },

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
