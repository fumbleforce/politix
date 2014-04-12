
setOwnerName = function (options) {
    Meteor.call('setOwnerName', _.extend({}, options));
};
createCorporation = function (options) {
    var id = Random.id();
    Meteor.call('createCorporation', _.extend({ _id: id }, options));
    return id;
};
acceptOrder = function (options) { Meteor.call('acceptOrder', options); };
sendChatMessage = function (options) { Meteor.call('sendChatMessage', options); };


