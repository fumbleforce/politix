
if (Meteor.isClient) {



}

else if (Meteor.isServer) {

    addResource = function (opts) {
        var action = {};
        action[opts.item] = opts.amount;

        Storage.update(storageId(), { $inc: action });
    };

    Meteor.methods({

        refreshMinerals: function () {

            var timeDelta,
                now = new Date();

            Miner.find({
                corporation: Meteor.user().corporation
            }).forEach(function (miner) {
                
                timeDelta = now - miner.lastRun;

                addResource({
                    item: miner.item,
                    amount: timeDelta * miningRate(miner),
                });
            });
        }
    });
}