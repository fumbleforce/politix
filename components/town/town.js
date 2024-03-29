 
Town = {};

Town.get = function () {
    return Meteor.user();
};

Town.set = function (key, val) {
    var data = {};
    data[key] = val;
    Meteor.users.update(Meteor.userId(), { $set: data } );
};





if (Meteor.isClient) {

function updateGenerated() {
    

    for (var b in Town.get().buildings) {
        var building = Building.expand(b, Town.get().buildings[b]);

        if (building.resource == undefined) continue;

        if (building.lastRelease == undefined) {
            building.lastRelease = new Date();
        }
        
        var timeDelta = new Date() - building.lastRelease;
        timeDelta = timeDelta / 1000 / 60;
        var workers = Town.get().settlers[building.worker];
        
        if (workers == undefined)
            workers = 0;
        else if (workers > building.maxWorkers[building.level])
            workers = building.maxWorkers[building.level];
        
        var releaseAmount = Math.floor(workers * timeDelta * building.gatherRates[building.level]);
        $("[generation='"+b+"']").html(releaseAmount);
    }
}

Meteor.startup(function () {
    if (!User.exists()) return;

    Meteor.setTimeout(updateGenerated, 1000);
    Meteor.setInterval(updateGenerated, 10000);

    Meteor.setInterval(function () {
        Meteor.call("TownPopGain", Error.hadler);
    }, 100000);
    Meteor.setInterval(function () {
        Meteor.call("TownGetTax", Error.handler);
    }, 60*60*1000);
})

Template.TownStatus.helpers({
    town: function () {
        return Meteor.user();
    }
})

Template.Town.helpers({

    town: function () {
        var t = Town.get().buildings.towncenter;
        var t = Building.expand("towncenter", t);
        t.nextLevel = t.level + 1;
        t.popCap = t.popCaps[t.level];
        t.nextPopCap = t.popCaps[t.level+1];
        t.buildCap = t.buildCaps[t.level];
        t.nextBuildCap = t.buildCaps[t.level+1];
        t.upgradeCosts = t.upgrade[t.level];
        t.maxLevel = t.level >= t.upgrade.length;
        // Populate full item name
        t.treasury = Town.get().treasury;
        t.administration = Town.get().administration;
        if (!t.maxLevel) {
            for (var i = 0; i < t.upgradeCosts.length; i++) {
                t.upgradeCosts[i].el = Item.get(t.upgradeCosts[i].id).el;
            }
        }

        return t;
    },

    taxIncome: function () {
        var t = Town.get();
        return Math.floor(t.settlers.total * t.administration.taxRate / 100);
    },

    settlers: function () {
        return Meteor.user().settlers;
    },

    buildings: function () {
        var fullBuildings = [],
            ownedBuildings = Meteor.user().buildings;

        for (var b in ownedBuildings) {

            // Combine standard building with player specific info
            var building = Building.expand(b, ownedBuildings[b]);

            building.maxWorkers = building.maxWorkers[building.level];
            building.activeWorkers = Town.get().settlers[building.worker] || 0;

            // Make upgrade information available to template
            building.upgradeCost = building.upgrade[building.level-1];

            // Populate full item name
            for (var i = 0; i < building.upgradeCost.length; i++) {
                building.upgradeCost[i].el = Item.get(building.upgradeCost[i].id).el;
            }
            fullBuildings.push(building);
        }
        return fullBuildings;
    },

    unbuilt: function () {
        var unbuilt = [];

        for (var b in Building.buildings) {
            if (!(b in Town.get().buildings) && b != "towncenter") {
                var building = Building.expand(b, {});
                building.upgradeCost = building.upgrade[0];
                // Populate full item name
                for (var i = 0; i < building.upgradeCost.length; i++) {
                    building.upgradeCost[i].el = Item.get(building.upgradeCost[i].id).el;
                }
                unbuilt.push(building);
            }
        }
        return unbuilt;
    },
});

Template.Town.events({
    "click .upgrade-town": function (e) {
        Meteor.call("TownUpgrade");
        
    },

    "click .upgrade-building": function (e) {
        Meteor.call("TownUpgradeBuilding", {id: $(e.target).attr("buildingid")});
    },

    "click .build-building": function (e) {
        Meteor.call("TownUpgradeBuilding", {id: $(e.target).attr("buildingid")});
    },

    "click .release-resources": function (e) {
        var b = $(e.target).attr("buildingid");
        Meteor.call("TownReleaseRec", b);
        $("[generation='"+b+"']").html(0);
    },

    "change #tax-rate": function (e) {
        var t = +$(e.target).val();
        Meteor.call("TownChangeTax", t);
    }
});




} else {

Meteor.startup(function () {
    
})


Meteor.methods({
    createTown: function (options) {
        
        check(options, {
            focus: NonEmptyString,
            name: NonEmptyString,
            mayor: NonEmptyString,
        });

        if (options.name.length > 100)
            throw new Meteor.Error(413, "Name too long");

        var t = {
            created:true,
            createDate: new Date,
            name: options.name,
            treasury: 10000.0,
            mayor: options.mayor,
            settlers: {
                total: 10,
                employed: 0,
                unemployed: 10,
                health: 100,
                equality: 100,
                loyalty: 100,
            },
            storage: [],
            buildings: {
                "towncenter": { level: 1 }
            },
            exploration: {
                active: {},
                equipment: {
                    "weapon": null,
                    "armor": null,
                    "utility": null,
                    "rations": null
                },
                experience: 0,
            },
            administration: {
                taxRate: 10,
            },
            army: {
                size: 0,
                health: 100,
                maxHealth: 100,
                morale: 100,
                maxMorale: 100,
                experience: 0,
                equipment: [],
                supplies: 100,
                troops: {
                    infantry: 0,
                    cavalry: 0,
                    artillery: 0,
                }
            }
        };

        switch (options.focus) {
            case "food":
                t.buildings["farm"] = { level: 1 };
                break;
            case "building":
                t.buildings["carpentry"] = { level: 1 };
                break;
            case "trading":
                t.buildings["tradepost"] = { level: 2 };
                break;
            case "mining":
                t.buildings["mine"] = { level: 1 };
                break;
            case "exploration":
                t.storage.push({ id: "torch", qty: 3 });
                break;
            case "warfare":
                t.buildings["barraks"] = { level: 1 };
                break;
            
                
        }

        User.update({ $set: t });
    },

    TownUpgrade: function () {
        var buildingId = "towncenter";
        console.log("Upgrading ", buildingId);

        // Upgrading existing
        var building = Building.expand(buildingId, Town.get());

        if (building.level >= building.upgrade.length)
            throw new Meteor.Error("Already max level");

        var hasPrereq = Storage.has(building.upgrade[building.level]);
        
        if (!hasPrereq)
            throw new Meteor.Error("Not enough resources to upgrade.");

        Meteor.call("StorageSpendMultiple", building.upgrade[building.level]);
        
        User.update({ 
            $inc: { 
                "buildings.towncenter.level": 1
            }
        });
    },

    TownUpgradeBuilding: function (opts) {
        var buildingId = opts.id;

        if (buildingId in Town.get().buildings) {
            // Upgrading existing
            console.log("Upgrading ", buildingId);
            var building = Building.expand(buildingId, Town.get().buildings[buildingId]);

            if (building.level === Town.get().level)
                throw new Meteor.Error("Cannot upgrade this building without first upgrading Town Center");

            if (building.level >= building.upgrade.length)
                throw new Meteor.Error("Already max level");

            var hasPrereq = Storage.has(building.upgrade[building.level]);
            
            if (!hasPrereq)
                throw new Meteor.Error("Not enough resources to upgrade.");

            Meteor.call("StorageSpendMultiple", building.upgrade[building.level]);
            
            var incObj = {};
            incObj["buildings."+buildingId+".level"] = 1;
            var setObj = {};
            setObj["buildings."+buildingId+".lastRelease"] = new Date();
            User.update({ $inc: incObj, $set: setObj });
            return true;

        } else {
            // Adding new building
            console.log("Building ", buildingId);
            var building = Building.get(buildingId);
            var hasPrereq = Storage.has(building.upgrade[0]);
            
            if (!hasPrereq)
                throw new Meteor.Error("Not enough resources to build.");

            Meteor.call("StorageSpendMultiple", building.upgrade[0]);

            var setObj = {};
            setObj["buildings."+buildingId] = {
                lastRelease: new Date(),
                level: 1
            };
            User.update({ $set: setObj });
        }
    },

    TownReleaseRec: function (buildingId) {
        console.log("\n_________TownReleaseRec_____________")
        var stock = Building.get(buildingId);

        if (stock.resource == undefined) return;

        if (stock == undefined)
            throw new Meteor.Error("Building does not exist.");

        if (!(buildingId in Town.get().buildings))
            throw new Meteor.Error("You don't own a "+stock.name);

        var building = Town.get().buildings[buildingId];

        if (building.lastRelease == undefined)
            building.lastRelease = new Date();

        var timeDelta = new Date() - building.lastRelease;
        timeDelta = timeDelta / 1000 / 60;
        var workers = Town.get().settlers[stock.worker];
        if (workers == undefined)
            workers = 0;
        else if (workers > stock.maxWorkers[building.level])
            workers = stock.maxWorkers[building.level];
        console.log("Workers: ", workers)
        var releaseAmount = Math.floor(workers * timeDelta * stock.gatherRates[building.level]);
        var resource = stock.resource;

        if (resource === "$") {
            Meteor.call("TreasuryEarn", { desc: "Trader income", amount: releaseAmount });
        } else {
            Meteor.call("StorageAdd", { id: resource, qty: releaseAmount });
        }

        var setObj = {};
        setObj["buildings."+buildingId+".lastRelease"] = new Date();
        User.update({ $set: setObj });
        console.log("Released "+ releaseAmount + " of " + resource);
    },

    TownPopGain: function () {
        console.log("Gaining population");

        var cap = Building.get("towncenter").popCaps[Town.get().buildings.towncenter.level];
        
        if (Town.get().settlers.total >= cap) return;

        User.update({ $inc: {
            "settlers.total": 1,
            "settlers.unemployed": 1 } });
    },

    TownChangeTax: function(rate) {
        console.log("Changing tax rate to ", rate);

        User.update({ $set: {
            "administration.taxRate": rate
            }
        });
    },

    TownGetTax: function () {
        console.log("Collecting taxes");

        var town = Town.get(),
            rate = town.administration.taxRate,
            pop = town.settlers.total,
            taxes = rate * pop;

        console.log(rate, pop, taxes);
        Meteor.call("TreasuryEarn", {
            desc: "Taxes",
            amount: taxes
        });

        Meteor.call("SettlerTaxReaction");
    }
    
});




}