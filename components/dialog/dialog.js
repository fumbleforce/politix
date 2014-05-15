
if (Meteor.isClient) {


    Template.dialogConfirm.question = function () {
        return Session.get("dialogQuestion");
    }

    Template.dialogConfirm.events({
        "click .yes": function () {
            Template.dialogConfirm.callback(true);
            hideView(".dialog-confirm");
        },
        "click .no": function () {
            Template.dialogConfirm.callback(false);
            hideView(".dialog-confirm");
        }
    })

    getConfirmation = function (question, callback) {

        Session.set("dialogQuestion", question);
        Template.dialogConfirm.callback = callback;

        displayView(".dialog-confirm");

    }

}