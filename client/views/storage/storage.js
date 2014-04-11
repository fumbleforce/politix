

Template.storage.storageList = function () {
    if (!getCorp()) return;

    
    return getStorage();
};


getStorage = function () {
    if (getCorp() && getCorp().storage) {
        var arr = asArray(getCorp().storage[1]);
        _.each(arr, function (item) {
            item.name = getItem(item.itemKey).name;
        });
        return arr;
    }
    return [];
};