
storage = {};

storageId = function () {
    if (!storage.id) {
        storage.id = Storage.findOne({
            corporation: Meteor.user().corporation
        })._id;
    }
    return storage.id;
};


