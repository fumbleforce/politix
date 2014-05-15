
if (Meteor.isClient) {


Template.chat.messages = function () {
	return ChatMessage.find({ channel: "global" });
};

Template.chat.events({
	"keypress input.chat-input": function (e) {
		console.log("Pressed "+e.keyCode);
		if (e.which == 13 || e.keyCode == 13) {
			var msg = $(e.currentTarget).val();
			sendChatMessage({ channel: "global", message: msg });
			$(e.currentTarget).val("");
		}
	}
});

Template.chat.rendered = function () {

    if (!this.rendered) {

        $(".chat").resize(function () {
            console.log("Resizing chat");
            $(".chat-message-list").css({
                "max-height": ($(".chat panel-body").height()-50) + "px",
                "height": ($(".chat panel-body").height()-50) + "px"
            });
        });
        
        this.rendered = true;
    }
};

} else {


    Meteor.methods({

        sendChatMessage: function (opts) {
            console.log("Sending message");
            console.log(opts);
            ChatMessage.insert({
                message: opts.message,
                sender: { name: getCorp().name, id: getCorp().id },
                channel: opts.channel
            });
        },


    });



}