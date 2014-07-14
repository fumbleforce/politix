if (Meteor.isClient) {

    Template.finance.helpers({
        transactions: function () {
            return Transaction.find({ $or: [
                { "sender.id": Meteor.user().corporation },
                { "receiver.id": Meteor.user().corporation },
            ]});
        },
        rendered: function () {

        },
        formatDate: function () {
            return this.time.toLocaleString();
        },
        
    });

    Template.finance.events({
        "click #finance-graphs-btn": function (e) {
            console.log("Making spark");
            $(".result-spark").show().sparkline([1,2,3,4,-5,-6,-7], {
                width: 200,
                height: 100
            });

        },
    });

} else {



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