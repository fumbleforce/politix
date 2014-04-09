

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