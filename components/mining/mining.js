


constructMiner = function ($el) {
    var minerId = +$el.attr("itemId");
    console.log("Constructing miner with id "+minerId);
    if (getFromStorage(minerId)) {
        Meteor.call("constructMiner", { minerId: minerId }, function (err) {
            if (err) informUser(err.message);
        });
    }
};


if (Meteor.isClient) {

    var minedDep = new Deps.Dependency();

    Template.mining.miners = function () {
        var miners = Miner.find({ corporation: Meteor.user().corporation }).fetch();
        if (miners.length) {
            miners = _.map(miners, function (m) {
                var item = getItem(m.minerId);
                return _.extend(m, item);
            });
            return miners;
        }
        return [];
    };

    Template.mining.mined = function () {
        minedDep.depend();
        return Template.mining.minedData;
    };


    var setMinedData = function () {
        var mined = {}

        miners = Miner.find({ corporation: Meteor.user().corporation });

        miners.forEach(function (miner) {
            amount = minDiff(miner.lastRun) * getItem(miner.minerId).props.miningRate;
            
            mined[getItem(miner.item).name.toLowerCase()] = ~~amount;
        });

        Template.mining.minedData = mined;
    };

    Template.mining.events({
        "click .add-miner": function () {
            Meteor.call("addMiner", {});
        },
        "click .release-minerals": function () {
            Meteor.call("refreshMinerals");
            setMinedData();
        }
    });

    mine = function () {

        if (!Template.mining.minedData)
            setMinedData();

        miners = Miner.find({ corporation: Meteor.user().corporation });

        miners.forEach(function (miner) {
            
            Template.mining.minedData[getItem(miner.item).name.toLowerCase()] += getItem(miner.minerId).props.miningRate;
        });

        minedDep.changed();
    };

    Meteor.setInterval(mine, 1000);

    


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
                
                timeDelta = Math.abs((now.getTime() - miner.lastRun.getTime()) / 1000);
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
