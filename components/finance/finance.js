if (Meteor.isClient) {

    Template.finance.transactions = function () {
        return Transaction.find({ $or: [
            { "sender.id": Meteor.user().corporation },
            { "receiver.id": Meteor.user().corporation },
        ]})
    };

    Template.finance.rendered = function () {

    };

    Template.finance.events({
        "click #finance-graphs-btn": function (e) {
            $(".result-spark").sparkline([1,2,3,4,-5,-6,-7], {
                width: 200,
                height: 100
            });
        }
    });

} else {



}