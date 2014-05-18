
if (Meteor.isClient) {


    Template.production.factories = function () {
        return Factory.find({ corporation: Meteor.user().corporation });
    };

    Template.production.constructable = function () {
        return getStorageList().filter(function (i) {
            return getItem(i.itemKey).type == "buildings" && i.amount;
        });
    };

    Template.production.events({
        "click .construct": function (e) {
            var build = $(e.currentTarget).attr('building');
            Meteor.call("constructFactory", { itemId: build }, function (err, stuff) {
                console.log(err);
                console.log(stuff);
            });
        }
    });

} else {


    Meteor.methods({
        constructFactory: function (opts) {
            var item = getItem(opts.itemId);
            
            if (item.type !== "buildings")
                throw new  Meteor.Error("Item not building");

            if (storageAmount(opts.itemId) < 1)
                throw new Meteor.Error(400, "Not enough buildings in storage");

            Meteor.call("removeItem", { item: opts.itemId, amount: 1 });

            return Factory.insert({
                corporation: Meteor.user().corporation,
                type: item.name,
                durability: 100,
                capacity: item.props.capacity,
                machines: []
            });
        }
    });



}

