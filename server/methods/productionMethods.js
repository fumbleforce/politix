Meteor.methods({
    constructFactory: function (opts) {
        var item = getItem(opts.itemId);
        
        if (item.type !== "buildings")
            throw new  Meteor.Error("Item not building");


        var storage = getCorp().storage;

        if (!storage[1][opts.itemId] || !storage[1][opts.itemId].amount)
            throw new Meteor.Error(400, "Not enough buildings in storage");

        storage[1][opts.itemId].amount -= 1;

        Corporation.update(Meteor.user().corporation,
            { $set: { "storage":storage } });

        return Factory.insert({
            corporation: Meteor.user().corporation,
            type: item.name,
            durability: 100,
            capacity: item.props.capacity,
            machines: []
        });
    }




});