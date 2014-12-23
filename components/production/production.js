
Production = {};

Production.constructFactory = function ($el) {
    var itemId = +$el.attr("itemId");
    Meteor.call("constructFactory", { itemId: itemId }, Error.handler);
};




if (Meteor.isClient) {


    Template.Production.helpers({
        factories: function () {
            return FactoryCollection.find({ corporation: Meteor.user().corporation });
        },

        constructable: function () {
            return Storage.getList().filter(function (i) {
                return Storage.get(i.itemKey).type == "buildings" && i.amount;
            });
        }
    });

    Template.Production.events({
        "click .construct": function (e) {
            var build = $(e.currentTarget).attr('building');
            Meteor.call("constructFactory", { itemId: build }, Error.handler);
        }
    });

} else {


    Meteor.methods({
        constructFactory: function (opts) {
            var item = Storage.get(opts.itemId);
            
            if (item.type !== "buildings")
                throw new  Meteor.Error(413, "Item is not building");

            if (Storage.count(opts.itemId) < 1)
                throw new Meteor.Error(400, "Not enough buildings in storage");

            Meteor.call("removeItems", { item: opts.itemId, amount: 1 });

            return FactoryCollection.insert({
                corporation: Meteor.user().corporation,
                type: item.name,
                durability: 100,
                capacity: item.props.capacity,
                machines: []
            });
        }
    });



}

