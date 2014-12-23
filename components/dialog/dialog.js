Dialog = {};

Dialog.informUser = function (info) {

    if (Meteor.isClient) {
        Session.set("dialogInfo", info);
        displayView(".dialog-alert");
    }
};

Dialog.getConfirmation = function (question, callback) {

    Session.set("dialogQuestion", question);
    Template.DialogConfirm.callback = callback;

    displayView(".dialog-confirm");

};

if (Meteor.isClient) {


    // Dialog Confirm

    Template.DialogConfirm.helpers({
        question: function () {
            return Session.get("dialogQuestion");
        }
    });

    Template.DialogConfirm.events({
        "click .yes": function () {
            Template.DialogConfirm.callback(true);
            hideView(".dialog-confirm");
        },
        "click .no": function () {
            Template.DialogConfirm.callback(false);
            hideView(".dialog-confirm");
        }
    });


    // Dialog Alert

    Template.DialogAlert.helpers({
        info: function () {
            return Session.get("dialogInfo");
        }
    });

    Template.DialogAlert.events({
        "click button.ok": function () {
            hideView(".dialog-alert");
        },
    });


}