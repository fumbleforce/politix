


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

    Template.mining.minedData = {
        iron: 123.00,
        aluminium: 234.00,
        coal: 12.00,
        gold: 111.00,
        copper: 222.00
    };

    Template.mining.events({
        "click .add-miner": function () {
            Meteor.call("addMiner", {});
        }
    });

    mine = function () {

        if (!Template.mining.minersCached)
            Template.mining.minersCached = Template.mining.miners();

        _.each(Template.mining.minersCached, function (miner) {
            
            Template.mining.minedData[getItem(miner.item).name.toLowerCase()] += miner.props.miningRate;
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
                
                timeDelta = now - miner.lastRun;
                amount = timeDelta * miner.miningRate;

                addItems({
                    item: miner.item,
                    amount: amount,
                });
            });
        },

        constructMiner: function (opts) {

            var minerId = opts.minerId,
                minerItem = getItem(minerId);

            console.log(minerId);
            console.log(minerItem);

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
