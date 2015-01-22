
Settlers = {};





if (Meteor.isClient) {

    Meteor.startup(function () {
        Meteor.setInterval(function () {
            Meteor.call("SettlerEat");
        }, 60*60*1000);
    });

    Template.Settlers.helpers({
        settlers: function () {
            return Meteor.user().settlers;
        },

        workers: function () {
            return _.map(Building.workerList, function (w) {
                var num = Meteor.user().settlers[w.id] || 0;
                if (w.id == "explorer")
                    num += Meteor.user().settlers["explorerBusy"] || 0;
                return {
                    number: num,
                    name: w.name,
                    id: w.id
                }
            })
        }

    });

    Template.Settlers.events({
        "click .add-worker": function (e) {
            var id = $(e.target).attr("workerid");
            Meteor.call("SettlerAdd", id, Error.handler);
        },
        "click .rem-worker": function (e) {
            var id = $(e.target).attr("workerid");
            Meteor.call("SettlerRem", id, Error.handler);
        },
    });

} else {

    Meteor.methods({

        SettlerAdd: function (id) {
            var settlers = Town.get().settlers,
                building = Building.getWorkerBuilding(id);

            if (!(building in Town.get().buildings))
                throw new Meteor.Error("You do not have a "+Building.get(building).name);

            var maxWorkers = Building.get(building).maxWorkers[Town.get().buildings[building].level];

            if (settlers.unemployed) {
                var active = settlers[id] || 0;
                if (id === "explorer")
                    active += settlers["explorerBusy"];

                if (active + 1 > maxWorkers)
                    throw new Meteor.Error("Already at max workers");

                settlers.unemployed--;
                settlers.employed++;
                if (settlers[id] == undefined) settlers[id] = 0;
                settlers[id]++;
            } else {
                throw new Meteor.Error("No unemployed settlers");
            }
            Meteor.call("TownReleaseRec", building)
            User.update({ $set: { "settlers": settlers } });
            console.log("Added a "+id);
        },

        SettlerRem: function (id) {
            var settlers = Town.get().settlers;

            if (settlers[id]) {
                settlers.unemployed++;
                settlers.employed--;
                settlers[id]--;
            } else {
                throw new Meteor.Error("No settler has this profession");
            }
            Meteor.call("TownReleaseRec", Building.getWorkerBuilding(id))
            User.update({ $set: { "settlers": settlers } });
            console.log("Removed a "+id);
        },

        SettlerRecruit: function () {
            var settlers = Town.get().settlers,
                army = Town.get().army,
                unemployed = settlers.unemployed;

            settlers.unemployed = 0;
            settlers.total -= unemployed;
            army.size += unemployed;
            army.troops.infantry += unemployed;
            army.experience -= unemployed * 10;
            if (army.experience < 0)
                army.experience = 0;

            User.update({ $set: {
                "settlers": settlers,
                "army": army,
            } });

        },

        SettlerTaxReaction: function () {
            var town = Town.get(),
                loyalty = town.settlers.loyalty,
                taxRate = town.administration.taxRate;

            loyalty -= (taxRate - 20) / 10;
            if (loyalty < 0) loyalty = 0;

            User.update({
                $set: {
                    "settlers.loyalty": loyalty,
                }
            });
        },

        SettlerEat: function () {
            console.log("Eating");

            var town = Town.get(),
                health = town.settlers.health,
                pop = town.settlers.total;

            if (Storage.hasCategory("food", pop)) {
                console.log("Has enough food")
                Meteor.call("StorageSpendCategory", {
                    category: "food",
                    qty: pop
                });
                if (health < 100) {
                    health += 1;
                }

                User.update({
                    $set: {
                        "settlers.health": health,
                    }
                });
            } else {
                console.log("No food");

                if (health > 0) {
                    health -= 1;
                }

                User.update({
                    $set: {
                        "settlers.health": health,
                    }
                });

                throw new Meteor.Error("The town is out of food!");
            }


        }
    })
}