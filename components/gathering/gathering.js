
Gathering = {};

Gathering.active = false;








if (Meteor.isClient) {

    Template.Gathering.helpers({


    })
    
    function remMsgs () {
        if ($(".status").children().length > 10) {
            $(".status").children()[0].remove();
        }
    }

    Template.Gathering.events({
        "click .chop-wood": function () {
            if (Gathering.active) return;
            Gathering.active = true;

            var num = Math.floor(Math.random() * 10);

            remMsgs();
            $(".status").append("<p>*Chomp*</p>");
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>*Chomp*</p>"); }, 1000);
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>*Chomp*</p>"); }, 2000);
            Meteor.setTimeout(function() {
                remMsgs();
                $(".status").append("<p>You got "+num+" "+Item.get("log").el+"</p>");
                Meteor.call("GatheringLogs");
            }, 3000);
            Meteor.setTimeout(function() { Gathering.active = false; }, 4000);
            
        },

        "click .gather-stone": function () {
            if (Gathering.active) return;
            Gathering.active = true;

            var num = Math.floor(Math.random() * 10);

            remMsgs();
            $(".status").append("<p>You search around the quarry for some loose stones</p>");
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>You found a small pile of rocks.</p>"); }, 1000);
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>You carry them back to town.</p>"); }, 2000);
            Meteor.setTimeout(function() {
                remMsgs();
                $(".status").append("<p>You got "+num+" "+Item.get("stone").el+"</p>");
                Meteor.call("GatheringStones");
            }, 3000);
            Meteor.setTimeout(function() { Gathering.active = false; }, 4000);
            
        },

        "click .dig": function () {
            if (Gathering.active) return;
            Gathering.active = true;

            var num = Math.floor(Math.random() * 10);

            remMsgs();
            $(".status").append("<p>You enter the dark mine outside of town.</p>");
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>Finding a metal vein, you start mining.</p>"); }, 1000);
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>You carry what you find back to town.</p>"); }, 2000);
            Meteor.setTimeout(function() {
                remMsgs();
                $(".status").append("<p>You got "+num+" "+Item.get("iron").el+"</p>");
                Meteor.call("GatheringMetal");
            }, 3000);
            Meteor.setTimeout(function() { Gathering.active = false; }, 4000);
            
        },

        "click .fish": function () {
            if (Gathering.active) return;
            Gathering.active = true;

            var num = Math.floor(Math.random() * 10);

            remMsgs();
            $(".status").append("<p>You sit down by the river and start casting.</p>");
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>A few fish take the bait.</p>"); }, 1000);
            Meteor.setTimeout(function() { remMsgs(); $(".status").append("<p>You carry your catch back to town.</p>"); }, 2000);
            Meteor.setTimeout(function() {
                remMsgs();
                $(".status").append("<p>You got "+num+" "+Item.get("fish").el+"</p>");
                Meteor.call("GatheringFish");
            }, 3000);
            Meteor.setTimeout(function() { Gathering.active = false; }, 4000);
            
        },


    });
} else {


    Meteor.methods({
        GatheringLogs: function () {
            var qty = Math.floor(Math.random() * 10),
                id = "log";
            Meteor.call("StorageAdd", { id: id, qty: qty });
            return qty;
        },
        GatheringMetal: function () {
            var qty = Math.floor(Math.random() * 10),
                id = "iron";
            Meteor.call("StorageAdd", { id: id, qty: qty });
            return qty;
        },
        GatheringStones: function () {
            var qty = Math.floor(Math.random() * 10),
                id = "stone";
            Meteor.call("StorageAdd", { id: id, qty: qty });
            return qty;
        },
        GatheringFish: function () {
            var qty = Math.floor(Math.random() * 10),
                id = "fish";
            Meteor.call("StorageAdd", { id: id, qty: qty });
            return qty;
        },
    })




}