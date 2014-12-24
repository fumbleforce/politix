
Mining = {};

var minedDep = new Deps.Dependency();
var updateInterval = 10;

Mining.getAll = function () {
    return MinerCollection.find({ corporation: Meteor.user().corporation });
};

Mining.constructMiner = function ($el) {
    var minerId = +$el.attr("itemId");
    
    if (Storage.get(minerId)) {
        Meteor.call("constructMiner", { minerId: minerId }, Error.handler);
    }
};

Mining.maxWorkers = function () {
    var max = 0;
    Mining.getAll().forEach(function (m) {
        max += Item.get(m.minerId).props.maxWorkers;
        console.log(Item.get(m.minerId))
    });
    console.log("max woorkers", max)
    return max;
};

Mining.activeWorkers = function () {
    return Employees.get({ state:"mining" });
};

Mining.mine = function () {

    var miners = Mining.getAll();

    if (!Template.Mining.minedData) {
        var mined = {}
        miners.forEach(function (miner) {
            amount = secDiff(miner.lastRun) * Item.get(miner.minerId).props.miningRate;
            
            mined[Item.get(miner.item).name.toLowerCase()] = ~~amount;
        });
        Template.Mining.minedData = mined;
    }


    miners.forEach(function (miner) {
        
        Template.Mining.minedData[Item.get(miner.item).name.toLowerCase()] += Item.get(miner.minerId).props.miningRate * updateInterval;
    });
    
    minedDep.changed();
};


if (Meteor.isClient && Meteor.userId()) {


    Template.Mining.helpers({
        miners: function () {
            var miners = Mining.getAll().fetch();
            if (miners.length) {
                miners = _.map(miners, function (m) {
                    var item = Item.get(m.minerId);
                    return _.extend(m, item);
                });
                return miners;
            }
            return [];
        },

        mined: function () {
            minedDep.depend();
            return Template.Mining.minedData;
        },

        needsWorker: function () {
            return Session.get("miningNeedsWorker");
        },

        workers: function () {
            var workers = [];
            Mining.activeWorkers().forEach(function (e) {
                workers.push({ name: e.name, free: false, id: e._id });
            });
            var active = workers.length;
            var max = Mining.maxWorkers();
            var empty = max - workers.length;

            for (var i = 0; i < empty; i++) {
                workers.push({ name: "", free: true });
            }

            Session.set("miningNeedsWorker", active < max);
            return workers;
        }
    });


    Template.Mining.events({
        "click .add-miner": function () {
            Meteor.call("addMiner", {}, Error.handler);
        },

        "click .add-worker": function () {
            Meteor.call("addWorker", {}, Error.handler);
        },

        "click .release-minerals": function () {
            Meteor.call("refreshMinerals");
            for (var key in Template.Mining.minedData) {
                Template.Mining.minedData[key] = 0;
            }
            minedDep.changed();
        },

        "click .remove-miner": function (e) {
            var id = $(e.target).attr("employeeid");
            console.log(id)
            Meteor.call("EmployeeState", { id: id, state:"free" });
        }
    });

    Meteor.startup(function () {
        Session.set("miningNeedsWorker", false);
        Mining.mine();
        Meteor.setInterval(Mining.mine, updateInterval * 1000);
    });

    


} else {

    Meteor.methods({

        refreshMinerals: function () {

            var timeDelta,
                amount,
                now = new Date(),
                miners = Mining.getAll();

            miners.forEach(function (miner) {
                
                timeDelta = secDiff(miner.lastRun);
                amount = ~~(timeDelta * Item.get(miner.minerId).props.miningRate);

                Meteor.call("addItems", {
                    item: miner.item,
                    amount: amount,
                });

                MinerCollection.update(miner._id, { $set: { lastRun: new Date() } });
            });
        },

        constructMiner: function (opts) {

            var minerId = opts.minerId,
                minerItem = Item.get(minerId);

            if (!minerId || !minerItem)
                throw new Meteor.Error(400, "Missing miner ID");

            if (minerItem.subType != "miner")
                throw new Meteor.Error(400, "Item is not a miner");

            if (!Storage.count(minerId))
                throw new Meteor.Error(413, "No miner in storage, had "+Storage.count(minerId));

            Meteor.call("removeItems", { item: minerId, amount: 1 });

            MinerCollection.insert({
                corporation: Meteor.user().corporation,
                minerId: minerId,
                upgrades: {},
                item: minerItem.defaultItem,
                workers: 0,
                lastRun: new Date()
            });

            Deps.flush();
        },

        addWorker: function () {

            if (Employees.count({state:"mining"}) >= Mining.maxWorkers)
                throw new Meteor.Error("At max workers");
            
            var workerAdded = Meteor.call("EmployeeWork", { type: "manual", state: "mining" });

            return workerAdded;
        },


    });



}
