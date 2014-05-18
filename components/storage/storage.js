

getStorage = function (loc) {
    if (getCorp()) {
        var s = Storage.findOne({ corporation: Meteor.user().corporation });
        return s;
    }
    return {};
};

getStorageList = function (loc) {

    var storage = getStorage();

    if (storage) {
        storage = storage["Volantis"];

        var arr = asArray(storage);
        _.each(arr, function (item) {
            item.name = getItem(item.itemKey).name;
            item.hide = item.amount === 0;
        });

        return arr;
    } else {
        return [];
    }
};

getFromStorage = function (id) {
    if (getCorp()) {
        return getStorage()["Volantis"][id];
    }
    return false;
};

storageCount = function (id) {
    if (getStorage()["Volantis"][id])
        return getStorage()["Volantis"][id].amount;
    return 0;
};



if (Meteor.isClient) {

    Template.storage.storageList = function () {
        if (!getCorp()) return;
        
        return getStorageList();
    };

    discardItem = function ($el) {
        var itemId = $el.attr("itemId"),
            quantity = $el.attr("quantity");

        var question = "Are you sure you want to discard " +
            quantity + " of " + getItem(itemId).name + "?";

        getConfirmation(question, function (res) {
            if (res) {
                Meteor.call("discardItem", { itemId: itemId, quantity: quantity });
            }
        });

    };

} else {

    Meteor.methods({

        discardItem: function (opts) {

            var storage = getStorage()["Volantis"];

            storage[opts.itemId].amount = 0;

            Storage.update({ corporation: Meteor.user().corporation },
                { $set: { "Volantis": storage } });
        },

        addItems: function (opts) {
            var action = {};
            action[opts.item] = opts.amount;

            Storage.update({ corporation: Meteor.user().corporation }, { "Volantis": { $inc: action } });
        },

        removeItems: function (opts) {
            opts.amount = -opts.amount;
            Meteor.call("addItems", opts);
        }

    });
}




