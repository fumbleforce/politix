
Storage = {};

Storage.get = function (loc) {
    if (Corporation.get()) {
        var s = StorageCollection.findOne({ corporation: Meteor.user().corporation });

        return s["Volantis"];
    }
    return {};
};

Storage.getList = function (loc) {

    var storage = Storage.get();

    if (storage) {
        var arr = asArray(storage);

        if (arr.length) {
            _.each(arr, function (item) {
                item.itemKey = item.key;
                item.name = Item.get(item.key).name;
                item.hide = item.value === 0;
                item.amount = item.value;
            });
        }
        

        return arr;
    } else {
        return [];
    }
};

Storage.getItem = function (id) {
    if (Corporation.get()) {
        return Storage.get()[id];
    }
    return false;
};

Storage.count = function (id) {
    if (Storage.get()[id])
        return Storage.get()[id];
    return 0;
};



if (Meteor.isClient) {

    Template.Storage.helpers({
        storageList: function () {
            if (!Corporation.get()) return;
            
            return Storage.getList();
        },

        locations: function () {
            return mapData.nodes.map(function (n) {
                return {
                    value: n.id,
                    label: n.label
                };
            });
        }
    });

    discardItem = function ($el) {
        var itemId = $el.attr("itemId"),
            quantity = $el.attr("quantity");

        var question = "Are you sure you want to discard " +
            quantity + " of " + Item.get(itemId).name + "?";

        Dialog.getConfirmation(question, function (res) {
            if (res) {
                Meteor.call("removeItems", { item: itemId, amount: quantity });
            }
        });

    };

} else {

    Meteor.methods({

        addItems: function (opts) {
            var action = {};
            action["Volantis."+opts.item] = opts.amount;

            StorageCollection.update({ corporation: Meteor.user().corporation },
                { $inc: action });
        },

        removeItems: function (opts) {
            opts.amount = -opts.amount;
            Meteor.call("addItems", opts);
        }

    });
}




