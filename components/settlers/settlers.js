
Settlers = {};





if (Meteor.isClient) {

    Template.Settlers.helpers({
        settlers: function () {
            return Meteor.user().settlers;
        },

    });

    Template.Settlers.events({
        "click .hire": function (e) {
            var id = +$(e.target).attr("workerid");
            Meteor.call("hireWorker", { id: id }, Error.handler);
        },
        "click .get-details": function (e) {
            var el = $(e.target).closest(".settler");
            if (el.attr("details-active") === "true")
                el.attr("details-active", false);
            else
                el.attr("details-active", true);
        }
    })

} else {

    Meteor.methods({
        hireWorker: function (opts) {
            console.log("opts: ", opts);
            if (opts.id == undefined)
                throw new Meteor.Error(400, "Missing worker id");

            if (Item.workers.length < opts.id)
                throw new Meteor.Error(400, "Worker does not exist");

            var emp = Item.workers[opts.id];
            emp.corporation = Meteor.user().corporation;
            emp.name = "Bob";
            emp.state = "free";
            emp.birth = new Date();
            emp.lastPaid = new Date();

            EmployeeCollection.insert(emp);

        },

        EmployeeWork: function (opts) {
            var type = opts.type,
                state = opts.state,
                foundWorker = false;
            console.log("Searching for a "+type+" worker for "+state);
            EmployeeCollection.find({
                corporation: Meteor.user().corporation,
                state:"free",
                type: type
            }).forEach(function (e) {
                if (!foundWorker) {
                    console.log("found ", e)
                    foundWorker = true;
                    EmployeeCollection.update(e._id, { $set: { "state": state }});
                }
            });

            if (!foundWorker)
                throw new MeteorError("No available settlers for "+state);

            return true;
        },

        EmployeeState: function (opts) {
            var id = opts.id,
                state = opts.state;

            EmployeeCollection.update(id, { $set: { "state": state }});
        }
    })
}