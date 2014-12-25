 
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
    Meteor.setTimeout(updateGenerated, 1000);
    Meteor.setInterval(updateGenerated, 10000);
})

Template.TownStatus.helpers({
    town: function () {
        return Meteor.user();
    }
})

Template.Town.helpers({
    rendered: function () {
        updateGenerated();
    },

    town: function () {
        var t = Town.get();
        var t = Building.expand("towncenter", t);
        t.nextLevel = t.level + 1;
        t.popCap = t.popCaps[t.level];
        t.nextPopCap = t.popCaps[t.level+1];
        t.buildCap = t.buildCaps[t.level];
        t.nextBuildCap = t.buildCaps[t.level+1];
        t.upgradeCosts = t.upgrade[t.level];
        t.maxLevel = t.level >= t.upgrade.length;
    // Populate full item name
        for (var i = 0; i < t.upgradeCosts.length; i++) {
            t.upgradeCosts[i].name = Item.get(t.upgradeCosts[i].id).name;
        }
        return t;
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
                building.upgradeCost[i].name = Item.get(building.upgradeCost[i].id).name;
            }
            fullBuildings.push(building);
        }
        return fullBuildings;
    },
});

Template.Town.events({
    "click .upgrade-town": function (e) {
        Meteor.call("TownUpgrade");
        
    },

    "click .upgrade-building": function (e) {
        Meteor.call("TownUpgradeBuilding", {id: $(e.target).attr("buildingid")});
    },

    "click .release-resources": function (e) {
        var b = $(e.target).attr("buildingid");
        Meteor.call("TownReleaseRec", b);
        $("[generation='"+b+"']").html(0);
    },
});




} else {


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
            level: 1,
            mayor: options.mayor,
            settlers: {
                total: 10,
                employed: 0,
                unemployed: 10,

            },
            storage: [],
            buildings: {
                "tradepost": { level: 1 }
            }
        };

        switch (options.focus) {
            case "food":
                t.buildings["farm"] = { level: 1 };
                break;
            case "building":
                t.buidlings["carpentry"] = { level: 1 };
                break;
            case "trading":
                t.buidlings["tradepost"] = { level: 2 };
                break;
            case "mining":
                t.buidlings["mine"] = { level: 1 };
                break;
            case "exploration":
                t.storage.push({ id: "torch", qty: 3 });
                break;
            case "warfare":
                t.buidlings["barraks"] = { level: 1 };
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
                "level": 1
            }
        });
    },

    TownUpgradeBuilding: function (opts) {
        var buildingId = opts.id;
        console.log("Upgrading ", buildingId);

        if (buildingId in Town.get().buildings) {
            // Upgrading existing
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

        }
    },

    TownReleaseRec: function (buildingId) {
        console.log("TownReleaseRec____________________________")
        var stock = Building.get(buildingId);
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
    }
});




}