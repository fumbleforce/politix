
if (Meteor.isClient) {


    // Dialog Confirm

    Template.dialogConfirm.question = function () {
        return Session.get("dialogQuestion");
    };

    Template.dialogConfirm.events({
        "click .yes": function () {
            Template.dialogConfirm.callback(true);
            hideView(".dialog-confirm");
        },
        "click .no": function () {
            Template.dialogConfirm.callback(false);
            hideView(".dialog-confirm");
        }
    });

    getConfirmation = function (question, callback) {

        Session.set("dialogQuestion", question);
        Template.dialogConfirm.callback = callback;

        displayView(".dialog-confirm");

    };



    // Dialog Alert

    Template.dialogAlert.info = function () {
        return Session.get("dialogInfo");
    };

    Template.dialogAlert.events({
        "click button.ok": function () {
            hideView(".dialog-alert");
        },
    });

    informUser = function (info, callback) {

        Session.set("dialogInfo", info);
        displayView(".dialog-alert");
    };





}