

if (Meteor.isClient) {

    Template.Exploration.helpers({
        exploration: function () {
            return Town.get().exploration;
        },

        explorers: function () {
            return Town.get().settlers.explorer || 0;
        },

        quests: function () {
            var active = Town.get().exploration.active;

            return Quest.quests;
        },

        equipment: function () {
            var eqs = Town.get().exploration.equipment;

            return eqs;
        },


    })
}