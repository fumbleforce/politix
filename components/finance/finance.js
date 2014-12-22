spend = function (opts) {
    console.log("Spending", opts.amount);

    Meteor.call("spend", opts, function (err) {
        if (err) {
            console.log(err);
            informUser(err.message);
            addEvent(err.message);
        }
    })
};

if (Meteor.isClient) {

    Session.set("financeDays", 1);

    Template.Finance.helpers({
        transactions: function () {
            return Transaction.find({ $or: [
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
            return getCorp().cash;
        },

        income: function () {
            var trans = Transaction.find({
                    corp: Meteor.user().corporation,
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
            var trans = Transaction.find({
                    corp: Meteor.user().corporation,
                    amount: { $lt: 0 },
                    time: { $gt: new Date((new Date()).setDate((new Date()).getDate()-Session.get("financeDays"))) }
                }),
                spent = 0;

            trans.forEach(function (t) {
                console.log(t.amount)
                spent += t.amount;
            });

            return spent;
        },

        result: function () {
            var trans = Transaction.find({
                    corp: Meteor.user().corporation,
                    time: { $gt: new Date((new Date()).setDate((new Date()).getDate()-Session.get("financeDays"))) }
                }),
                result = 0;

            trans.forEach(function (t) {
                console.log(t);
                result += t.amount;
            });

            return result;
        },
        
    });

    Template.Finance.events({
        "click #finance-graphs-btn": function (e) {
            console.log("Making spark");
            $(".result-spark").show().sparkline([1,2,3,4,-5,-6,-7], {
                width: 200,
                height: 100
            });
        },
        "click .time-filter button": function (e) {
            Session.set("financeDays", +$(e.target).attr("days"));
        }
    });

    

} else {

    Meteor.methods({
        spend: function (opts) {
            var amount = opts.amount;

            opts.corp = Meteor.user().corporation;
            opts.time = new Date();

            if (amount > amount)
                throw new Meteor.Error(413, "Not enough cash");

            Transaction.insert(opts);
            console.log("INSERTING TRANSACTION")

            Corporation.update(Meteor.user().corporation,
                { $inc: { "cash": -amount } });

        }
    })

}


financeGraph = function(container, financeData) {
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

  return new envision.templates.Finance(options);
};