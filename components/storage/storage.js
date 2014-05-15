

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
                console.log(res);
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
        }

    });
}




