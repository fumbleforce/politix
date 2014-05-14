


Session.set("events", []);

addEvent = function (msg) {
    var events = Session.get("events");
    events.push({ message: msg });
    if (events.length > 5)
        events.shift();
    Session.set("events", events);
};

Template.eventList.events = function () {
    return Session.get("events").reverse();
};