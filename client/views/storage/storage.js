

Template.storage.storageList = function () {
    if (!getCorp()) return;

    var arr = asArray(getCorp().storage[1]);
    _.each(arr, function (item) {
        item.name = getItem(item.itemKey).name;
    });
    console.log(arr);
    return arr;
};