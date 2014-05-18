

getStorage = function (loc) {
    if (getCorp()) {
        var s = Storage.findOne({ corporation: Meteor.user().corporation });

        return s["Volantis"];
    }
    return {};
};

getStorageList = function (loc) {

    var storage = getStorage();

    if (storage) {
        var arr = asArray(storage);

        if (arr.length) {
            _.each(arr, function (item) {
                item.itemKey = item.key;
                item.name = getItem(item.key).name;
                item.hide = item.value === 0;
                item.amount = item.value;
            });
        }
        

        return arr;
    } else {
        return [];
    }
};

getFromStorage = function (id) {
    if (getCorp()) {
        return getStorage()[id];
    }
    return false;
};

storageCount = function (id) {
    if (getStorage()[id])
        return getStorage()[id];
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
                Meteor.call("removeItems", { item: itemId, amount: quantity });
            }
        });

    };

} else {

    Meteor.methods({

        addItems: function (opts) {
            var action = {};
            action["Volantis."+opts.item] = opts.amount;

            Storage.update({ corporation: Meteor.user().corporation },
                { $inc: action });
        },

        removeItems: function (opts) {
            opts.amount = -opts.amount;
            Meteor.call("addItems", opts);
        }

    });
}




