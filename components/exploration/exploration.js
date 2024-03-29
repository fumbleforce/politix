var qDep = new Deps.Dependency();

if (Meteor.isClient) {

    Meteor.startup(function () {
        Session.set("questCompleted", new Date());
        Session.set("invitationSearchTerm", "");
    })

    Template.Exploration.helpers({
        exploration: function () {
            return Town.get().exploration;
        },

        explorers: function () {
            return Town.get().settlers.explorer || 0;
        },

        explorersBusy: function () {
            return Town.get().settlers.explorerBusy || 0;
        },

        quests: function () {
            var active = Town.get().exploration.active,
                expanded = [];
            for (var i = 0; i < Quest.quests.length; i++) {
                var q = Quest.quests[i];
                if (q.id in active) {
                    $.extend(q, active[q.id]);
                    q.active = true;
                } else {
                    q.active = false;
                }
                expanded.push(q);
            }
            return expanded;
        },

        lastCompleted: function () {
            return Session.get("questCompleted");
        },

        equipment: function () {
            var eqs = Town.get().exploration.equipment;
            for (var slot in eqs) {
                if (eqs[slot] != null || eqs[slot] != undefined) {
                    eqs[slot] = Item.get(eqs[slot]);
                }
            }
            return eqs;
        },

        freeSlot: function () {
            return Town.get().exploration.equipment.length < 5;
        },

        party: function () {
            return Town.get().exploration.party;
        },


    });

    Template.Exploration.events({
        "click .start-quest": function (e) {
            var id = $(e.target).attr("questid"),
                active = Town.get().exploration.active;

            if (!(id in active)) {
                var end = Meteor.call("QuestStart", id, function (err, end) {
                    if (err) {
                        Event.addEvent(err.message);
                        return;
                    }
                    console.log(end)
                    end = new Date(end);

                    var myCounter = new Countdown({  
                        end: end,
                        onUpdateStatus: function (sec) { $(".countdown[questid='"+id+"']").html(sec); }, // callback for each second
                        onCounterEnd: function () { $(".countdown[questid='"+id+"']").html("Completed"); } // final action
                    });

                    myCounter.start();
                });
            }
        },

        "click .add-explorer": function () {
            var val = +$("input.party-explorers").val();
            console.log(val)
            if (Town.get().settlers.explorer > val) {
                $("input.party-explorers").val(val+1);
            }
        },
        "click .rem-explorer": function () {
            var val = +$("input.party-explorers").val();
            if (val > 0) {
                $("input.party-explorers").val(val-1);
            }
        },

        "click .complete-quest": function (e) {
            var id = $(e.target).attr("questid"),
                active = Town.get().exploration.active;

            if (!(id in active)) return;
            
            var a = active[id],
                now = new Date(),
                seconds = (new Date(a.end)).getTime() - now.getTime();

            seconds = seconds / 1000;

            if (seconds <= 0) {
                Meteor.call("QuestComplete", id, function (err, data) {
                    console.log("completed ", id);
                    Session.set("questCompleted", new Date());
                    Event.addEvent("You received "+ Item.get(data.reward).el + " and "+data.exp+" exp. for your efforts!");
                    //$(".qstatus[questid='"+id+"']").empty().append("<div class='btn start-quest' questid='"+id+"'>Start</div>");
                });
            }
        },

        "click .equipment": function (e) {
            var slot = $(e.target).closest(".equipment").attr("slot");
            Session.set("equipmentSlot", slot);

            Router.go("ExplorationEquipment");
        },

        "click .invite": function (e) {
            Router.go("ExplorationInvite");
        }
    });

    Template.ExplorationEquipment.helpers({
        equipments: function () {
            return Storage.getCategory(Session.get("equipmentSlot"));
        }
    });

    Template.ExplorationEquipment.events({
        "click .equipment-choice": function (e) {
            var id = $(e.target).closest(".equipment-choice").attr("itemid");
            console.log("session:", Session.get("equipmentSlot"))
            Meteor.call("ExplorationSetEquipment", {
                "slot": Session.get("equipmentSlot"),
                "id": id
            });

            Router.go("Exploration");
        },
        "click .back": function () {
            Router.go("Exploration");
        }
    });

    var invSearchDep = new Tracker.Dependency();

    Template.ExplorationInvite.helpers({
        results: function () {
            var term = Session.get("invitationSearchTerm");
            console.log("new term")
            if (term.length < 3) return [];
            console.log("Updated results")
            return Meteor.users.find({
                $or: [
                    { $where: "this.mayor.indexOf('"+
                        term+"') != -1" },
                    { $where: "this.name.indexOf('"+
                        term+"') != -1" },
                ]
            });
        }
    });

    Template.ExplorationInvite.events({
        "change #search-player": function (e) {
            var term = $(e.target).val();
            Session.set("invitationSearchTerm", term);
            console.log("term set to ", term);
            invSearchDep.changed();
        },
        "click .back": function () {
            Router.go("Exploration");
        }
    });


} else {


    Meteor.methods({
        QuestStart: function (id) {
            var quest = Quest.get(id),
                started = {
                    id: id,
                    end: (new Date()).setSeconds((new Date()).getSeconds() + quest.time)
                },
                upObj = {},
                explorers = Town.get().settlers.explorer,
                busy = Town.get().settlers.explorerBusy;

            if (explorers == undefined || explorers <= 0)
                throw new Meteor.Error("No explorers available");

            started.explorers = explorers;
            upObj["exploration.active."+id] = started;
            upObj["settlers.explorerBusy"] =  busy + explorers;
            upObj["settlers.explorer"] = 0;
            User.update({ $set: upObj });
            console.log("Started quest,", started);
            return started.end;
        },

        QuestComplete: function (id) {
            var quest = Quest.get(id),
                active = Town.get().exploration.active,
                busy = Town.get().settlers.explorerBusy,
                explorers = Town.get().settlers.explorer,
                now = new Date();

            if (!(id in active))
                throw new Meteor.Error("Quest not active");

            var q = active[id],
                seconds = (new Date(q.end)).getTime() - now.getTime();

            seconds = seconds / 1000;

            if (seconds > 0)
                throw new Meteor.Error("Quest is not finished");

            console.log("Completed quest", id);

            var upObj = {};
            upObj["settlers.explorer"] = explorers + q.explorers;
            upObj["settlers.explorerBusy"] = busy - q.explorers;
            
            delete active[id];
            upObj["exploration.active"] = active

            var exp = quest.exp + Math.floor(Math.random() * quest.exp);
            upObj["exploration.experience"] = Town.get().exploration.experience + exp;

            User.update({ $set: upObj });

            console.log("Danger: ", quest.danger);
            var lootLevel = randLootLevel(quest.danger);
            console.log("LootLevel", lootLevel);
            if (lootLevel < 0) {
                return { reward: "none", exp: exp }
            }
            var reward = Item.rand(lootLevel);
            console.log("Reward", reward);

            Meteor.call("StorageAdd", { id: reward.id, qty: 1 });
            return { reward: reward.id, exp: exp }
        },

        ExplorationSetEquipment: function (opts) {
            var id = opts.id,
                slot = opts.slot,
                setObj = {};
            console.log(id, slot)
            setObj["exploration.equipment."+slot] = id;
            User.update({ $set: setObj });
        }
    })
}