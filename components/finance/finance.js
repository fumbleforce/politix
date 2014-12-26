Wallet = {};

Wallet.spend = function (opts) {
    Meteor.call("spend", opts, Error.handler);
};

Wallet.financeGraph = function(container, financeData) {
    container = $(container)[0];

    var
        summaryTicks = financeData.summaryTicks,
        options = {
        container : container,
        data : {
          price : financeData.price,
          volume : financeData.volume,
          summary : financeData.price
        },
    trackFormatter : function (o) {

      var
        data = o.series.data,
        index = data[o.index][0],
        value;

      value = summaryTicks[index].date + ': $' + summaryTicks[index].close + ", Vol: " + summaryTicks[index].volume;

      return value;
    },
    xTickFormatter : function (index) {
      var date = new Date(financeData.summaryTicks[index].date);
      return date.getFullYear() + '';
    },
    // An initial selection
    selection : {
      data : {
        x : {
          min : 100,
          max : 200
        }
      }
    }
  };

  return new envision.templates.Treasury(options);
};

if (Meteor.isClient) {

    // Number of days to query transactions for.
    Session.set("financeDays", 1);

    Template.Treasury.helpers({
        transactions: function () {
            return TransactionCollection.find({ $or: [
                { "corp": Meteor.user().corporation },
            ]});
        },
        rendered: function () {

        },
        formatDate: function () {
            return this.time.toLocaleString();
        },

        timeFilter: function () {
            return Session.get("financeDays")
        },

        cash: function () {
            return Meteor.user().treasury;
        },

        income: function () {
            var trans = TransactionCollection.find({
                    amount: { $gt: 0 },
                    time: { $gt: new Date((new Date()).setDate((new Date()).getDate()-Session.get("financeDays"))) }
                }),
                earned = 0;

            trans.forEach(function (t) {
                earned += t.amount;
            });

            return earned;
        },

        expences: function () {
            var trans = TransactionCollection.find({
                    amount: { $lt: 0 },
                    time: { $gt: new Date((new Date()).setDate((new Date()).getDate()-Session.get("financeDays"))) }
                }),
                spent = 0;

            trans.forEach(function (t) {
                spent += t.amount;
            });

            return spent;
        },

        result: function () {
            var trans = TransactionCollection.find({
                    time: { $gt: new Date((new Date()).setDate((new Date()).getDate()-Session.get("financeDays"))) }
                }),
                result = 0;

            trans.forEach(function (t) {
                result += t.amount;
            });

            return result;
        },
        
    });

    Template.Treasury.events({
        "click #finance-graphs-btn": function (e) {
            console.log("Making spark");
            $(".result-spark").show().sparkline([1,2,3,4,-5,-6,-7], {
                width: 200,
                height: 100
            });
        },
        "click .time-filter .btn": function (e) {
            Session.set("financeDays", +$(e.target).attr("days"));
        }
    });

    

} else {

    Meteor.methods({
        TreasurySpend: function (opts) {
            var amount = +opts.amount;

            if (isNaN(amount))
                throw new Meteor.Error("Amount is Nan: ", opts.amount);

            opts.user = Meteor.userId();
            opts.time = new Date();

            if (amount > Town.get().treasury)
                throw new Meteor.Error(413, "Not enough cash");

            if (amount < 0.1) return;
            
            TransactionCollection.insert(opts);

            Meteor.users.update(Meteor.userId(),
                { $inc: { "treasury": -amount } });

        },

        TreasuryEarn: function (opts) {
            var amount = opts.amount;

            opts.user = Meteor.userId();
            opts.time = new Date();

            if (amount < 0.1) return;

            TransactionCollection.insert(opts);

            Meteor.users.update(Meteor.userId(),
                { $inc: { "treasury": amount } });
        }
    })

}
