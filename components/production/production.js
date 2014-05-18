

constructFactory = function ($el) {
    var itemId = +$el.attr("itemId");

    Meteor.call("constructFactory", { itemId: itemId }, function (err) {
        if (err) informUser(err.message);
    });
}




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
            Meteor.call("constructFactory", { itemId: build }, function (err) {
                if (err) informUser(err.message);
            });
        }
    });

} else {


    Meteor.methods({
        constructFactory: function (opts) {
            var item = getItem(opts.itemId);
            
            if (item.type !== "buildings")
                throw new  Meteor.Error(413, "Item is not building");

            if (storageCount(opts.itemId) < 1)
                throw new Meteor.Error(400, "Not enough buildings in storage");

            Meteor.call("removeItems", { item: opts.itemId, amount: 1 });

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

