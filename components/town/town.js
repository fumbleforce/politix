 
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


Template.Town.helpers({
    town: function () {
        return Meteor.user();
    },
    settlers: function () {
        return Meteor.user().settlers;
    },
    buildings: function () {
        var fullBuildings = [],
            ownedBuildings = Meteor.user().buildings
        for (var b in ownedBuildings) {
            var stockBuilding = Building.get(b);
            $.extend(stockBuilding, ownedBuildings[b]);
            fullBuildings.push(stockBuilding)
        }
        return fullBuildings;
    },
});

Template.Town.events({
    "click .upgrade-town": function (e) {
        Meteor.call("TownUpgrade");
        
    }
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
        User.update({ 
            $inc: { 
                "level": 1
            }
        });
    }
});




}