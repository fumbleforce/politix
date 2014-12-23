

Event = {};

Event.addEvent = function (msg) {
    if (Meteor.isClient) {

        var events = Session.get("events");
        events.push({ message: msg });
        if (events.length > 5)
            events.shift();

        Session.set("events", events);
    }
};

if (Meteor.isClient) {
    Session.set("events", []);

    Template.EventList.helpers({
        events: function () {
            return Session.get("events").reverse();
        }
    });
    
}