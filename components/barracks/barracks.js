


if (Meteor.isClient) {

    Meteor.startup(function () {
        if (Town.get() == null || Town.get() == undefined) return;
        
        if ((new Date() - Town.get().army.lastSupplyRun) / 1000 / 60 /60 / 24 > 1)
            Meteor.call("BarracksConsumeSupplies");

        Meteor.call("BarracksUpdateMorale");
        Meteor.setInterval(function () {
            Meteor.call("BarracksUpdateMorale");
        }, 1000 * 60 * 60);
    });

    Template.Barracks.helpers({
        army: function () {
            return Town.get().army;
        },
        volunteers: function () {
            return Town.get().settlers.unemployed;
        },
        supplies: function () {
            return Town.get().army.supplies;
        },
        supplyCost: function () {
            return Town.get().army.supplies * Town.get().army.size;
        },
        troops: function () {
            return Town.get().army.troops;
        }
    });

    Template.Barracks.events({
        "click .recruit": function (e) {
            Meteor.call("SettlerRecruit", Error.handler);
        },
        "change .supplies": function (e) {
            var val = +$(e.target).val();
            Meteor.call("BarracksSupplies", val);
        }
    })

} else {

    Meteor.methods({
        BarracksSupplies: function (supplies) {
            if (isNaN(+supplies))
                throw new Meteor.Error(supplies + " is no a number");

            Meteor.call("BarracksConsumeSupplies");
            User.update({ $set: { "army.supplies": +supplies } });
        },

        BarracksConsumeSupplies: function () {
            var army = Town.get().army;
            if (army.lastSupplyRun == undefined)
                army.lastSupplyRun = new Date()

            var timeDelta = new Date() - army.lastSupplyRun;
            timeDelta = timeDelta / 1000 / 60 / 60 / 24;
            var supplyCost = army.supplies * army.size * timeDelta;
            Meteor.call("TreasurySpend", { amount: supplyCost, desc: "Army supplies" });

            User.update({
                $set: { "army.lastSupplyRun": new Date() }
            });
        },

        BarracksUpdateMorale: function () {
            var army = Town.get().army;

            if (army.morale < army.supplies) {
                User.update({ $inc: { "army.morale": 1 } });
            } else if (army.morale > army.supplies) {
                User.update({ $inc: { "army.morale": -1 } });
            }
        }
    })
}