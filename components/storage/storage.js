 
Storage = {};

Storage.get = function () {
    return Meteor.user().storage
};

Storage.getCategory = function (category) {
    var expanded = _.map(Town.get().storage, function (i) { return Item.get(i.id); });
    return _.filter(expanded, function (i) { return i.category === category });
};

Storage.getExpanded = function () {
    return _.map(Storage.get(), function (item) {
        if (item == undefined) return;

        $.extend(item, Item.get(item.id));
        return item;
    });
}

Storage.spend = function (id, qty) {
    if (Storage.hasItem(id, qty)) {
        Meteor.call("StorageSpend", found);
        return true;
    }
    return false;
};

Storage.add = function (id, qty) {
    Meteor.call("StorageAdd", { id: id, qty: qty });
};

Storage.hasItem = function (id, qty) {
    var storage = Storage.get(),
        found = [],
        enough = false,
        need = qty;

    for (var i = 0; i < storage.length; i++) {
        var item = storage[i].id,
            quantity = storage[i].qty;

        if (item === id) {
            if (quantity < need) {
                found.push({ pos: i, qty: quantity, id: id });
            } else {
                found.push({ pos: i, qty: need, id: id });
                enough = true;
                break;
            }
        }
    }
    return enough;
}

Storage.has = function (items) {
    for (var i = 0; i < items.length; i++) {
        var hasOne = Storage.hasItem(items[i].id, items[i].qty);
        if (!hasOne) return false;
    }
    return true;
}



if (Meteor.isClient) {

    Template.Storage.helpers({
        storageList: function () {
            return Storage.getExpanded();
        },
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

        StorageSpend: function (posqty) {
            var s = Meteor.user().storage;
            for (var i = 0; i < posqty.length; i++) {
                if (s[posqty[i].pos].id != posqty[i].id) 
                    throw new Meteor.Error("Position in storage spending invalid");

                s[posqty[i].pos].qty -= posqty[i].qty;
                if (s[posqty[i].pos].qty <= 0) {
                    s[posqty[i].pos] = undefined;
                }
            }
            User.update({ $set: { storage: s } });
        },

        StorageSpendMultiple: function (items) {
            var storage = Meteor.user().storage;

            for (var i = 0; i < items.length; i++) {
                for (var pos = 0; pos < storage.length; pos++) {
                    if (storage[pos].id === items[i].id) {
                        storage[pos].qty -= items[i].qty;
                        if (storage[pos].qty === 0) {
                            storage[pos] = undefined;
                        } else if (storage[pos].qty < 0) {
                            throw new Meteor.Error("Not enough items to remove, homework was not done.");
                        }
                    }
                }
            }
            var remNum = 0;
            for (var p = 0; p < storage.length; p++) {
                if (storage[p] == undefined) {
                    remNum++;
                    for (var x = p; x < storage.length-1; x++) {
                        var temp = storage[x];
                        storage[x] = storage[x+1];
                        storage[x+1] = temp;
                    }
                }
            }
            storage.length -= remNum;
            User.update({ $set: { storage: storage } });
        },

        StorageAdd: function (opts) {
            var storage = Storage.get(),
                id = opts.id,
                qty = +opts.qty,
                hasPos = false;

            if (isNaN(qty))
                throw new Meteor.Error("Quantity is NaN: " + opts.qty);

            for (var i = 0; i < storage.length; i++) {
                if (storage[i].id === id) {
                    storage[i].qty += qty;
                    hasPos = true;
                    break;
                }
            }
            if (!hasPos) {
                storage.push({ id: id, qty: qty });
            }
            User.update({ $set: { storage: storage } });
        }

    });
}




