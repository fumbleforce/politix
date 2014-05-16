
if (Meteor.isClient) {

    var minedDep = new Deps.Dependency();

    Template.mining.miners = function () {
        return Miner.find({ corporation: Meteor.user().corporation });
    };

    Template.mining.mined = function () {
        minedDep.depend();
        return Template.mining.minedData;
    };

    Template.mining.minedData = {
        iron: 123,
        aluminium: 234,
        coal: 12,
        gold: 111,
        copper: 222
    };

    Template.mining.events({
        "click .add-miner": function () {
            Meteor.call("addMiner", {});
        }
    });

    mine = function () {

        Template.mining.miners.forEach(function (miner) {
            
            Template.mining.minedData.iron += 10;
            Template.mining.minedData.gold += 6;
            Template.mining.minedData.copper += 3;
        });

        minedDep.changed();
    };

    Meteor.setInterval(mine, 1000);




} else {

    Meteor.methods({


        addResource: function (opts) {
            var action = {};
            action[opts.item] = opts.amount;

            Storage.update({ corporation: Meteor.user().corporation }, { "Volantis": { $inc: action } });
        },


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

                addResource({
                    item: miner.item,
                    amount: amount,
                });
            });
        },


    });



}
