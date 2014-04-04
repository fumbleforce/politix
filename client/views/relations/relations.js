Template.relations.Corporation = function () {
    return Corporation.find();
};

Template.relations.events({
    'click input': function () {
        // template data, if any, is available in 'this'
        if (typeof console !== 'undefined')
            console.log("You pressed the button");
    }
});