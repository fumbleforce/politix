

Template.finance.rendered = function () {
    console.log("Rendered finance");
}

Template.finance.events({
    "click #finance-graphs-btn": function (e) {
        $(".result-spark").sparkline([1,2,3,4,-5,-6,-7], {
            width: 200,
            height: 100
        });
    }
})