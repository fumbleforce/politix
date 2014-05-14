

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

} else {


}




