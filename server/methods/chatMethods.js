
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