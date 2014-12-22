


constructMiner = function ($el) {
    var minerId = +$el.attr("itemId");
    
    if (getFromStorage(minerId)) {
        Meteor.call("constructMiner", { minerId: minerId }, function (err) {
            if (err) informUser(err.message);
        });
    }
};


if (Meteor.isClient && Meteor.userId()) {

    var minedDep = new Deps.Dependency();

    Template.Mining.helpers({
        miners: function () {
            var miners = Miner.find({ corporation: Meteor.user().corporation }).fetch();
            if (miners.length) {
                miners = _.map(miners, function (m) {
                    var item = getItem(m.minerId);
                    return _.extend(m, item);
                });
                return miners;
            }
            return [];
        },

        mined: function () {
            minedDep.depend();
            return Template.Mining.minedData;
        }
    });



    Template.Mining.events({
        "click .add-miner": function () {
            Meteor.call("addMiner", {});
        },
        "click .release-minerals": function () {
            Meteor.call("refreshMinerals");
            for (var key in Template.Mining.minedData) {
                Template.Mining.minedData[key] = 0;
            }
            minedDep.changed();
        }
    });

    var updateInterval = 10;

    mine = function () {
        if (window.Miner == undefined) return;

        var miners = Miner.find({ corporation: Meteor.user().corporation });

        if (!Template.Mining.minedData) {
            var mined = {}
            miners.forEach(function (miner) {
                amount = secDiff(miner.lastRun) * getItem(miner.minerId).props.miningRate;
                
                mined[getItem(miner.item).name.toLowerCase()] = ~~amount;
            });
            Template.Mining.minedData = mined;
        }


        miners.forEach(function (miner) {
            
            Template.Mining.minedData[getItem(miner.item).name.toLowerCase()] += getItem(miner.minerId).props.miningRate * updateInterval;
        });
        
        minedDep.changed();
    };

    mine();
    Meteor.setInterval(mine, updateInterval * 1000);

    


} else {

    Meteor.methods({



        refreshMinerals: function () {

            var timeDelta,
                amount,
                now = new Date(),
                miners = Miner.find({
                    corporation: Meteor.user().corporation
                });

            miners.forEach(function (miner) {
                
                timeDelta = secDiff(miner.lastRun);
                amount = ~~(timeDelta * getItem(miner.minerId).props.miningRate);

                Meteor.call("addItems", {
                    item: miner.item,
                    amount: amount,
                });

                Miner.update(miner._id, { $set: { lastRun: new Date() } });
            });
        },

        constructMiner: function (opts) {

            var minerId = opts.minerId,
                minerItem = getItem(minerId);

            if (!minerId || !minerItem)
                throw new Meteor.Error(400, "Missing miner ID");

            if (minerItem.subType != "miner")
                throw new Meteor.Error(400, "Item is not a miner");

            if (!storageCount(minerId))
                throw new Meteor.Error(413, "No miner in storage, had "+storageCount(minerId));

            Meteor.call("removeItems", { item: minerId, amount: 1 });

            Miner.insert({
                corporation: Meteor.user().corporation,
                minerId: minerId,
                upgrades: {},
                item: minerItem.defaultItem,
                workers: 0,
                lastRun: new Date()
            });

            Deps.flush();
        }


    });



}
